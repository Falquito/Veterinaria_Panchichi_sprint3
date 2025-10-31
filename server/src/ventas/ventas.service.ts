import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { Clientes } from 'src/entities/Cliente.entity';
import { Movimientos } from 'src/entities/Movimientos.entity';
import { MovimientosService } from 'src/movimientos/movimientos/movimientos.service';
import { CreateMovimientoDto, detalleMovimientoDto } from 'src/movimientos/movimientos/dto/create-movimiento.dto';
import { CapturePaypalSaleDto } from './dto/capture-paypal-sale.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectDataSource()
    private readonly dataSource:DataSource,
    @Inject(MovimientosService)
    private readonly movimientoService:MovimientosService,
    @InjectRepository(Venta)
    private readonly ventasRepository:Repository<Venta>
  ){}

  async create(createVentaDto: CreateVentaDto) {

    const {total,items,billingInfo,cardInfo} = createVentaDto
    const queryRunner = this.dataSource.createQueryRunner()
    let detalleMov:detalleMovimientoDto[]=[]
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()


      // Lógica de "Find or Create" para Cliente
      let cliente = await queryRunner.manager.findOneBy(Clientes, {
        email: billingInfo.email
      });

      if (!cliente) {
        cliente = queryRunner.manager.create(Clientes, {
          nombre: billingInfo.name,
          email: billingInfo.email
          // ... (otros campos de cliente si los tienes)
        });
        await queryRunner.manager.save(cliente);
      }
      // 1. Obtener la fecha de hoy
      const today = new Date();

      // 2. Obtener las partes de la fecha
      const year = today.getFullYear();

      // getMonth() devuelve 0-11, por eso sumamos 1
      // padStart(2, '0') asegura que tengamos '01', '02', etc.
      const month = (today.getMonth() + 1).toString().padStart(2, '0');

      // getDate() devuelve el día del mes
      const day = today.getDate().toString().padStart(2, '0');

      // 3. Unir todo
      const formattedDate = `${year}-${month}-${day}`;
      const venta = queryRunner.manager.create(Venta,{
        total:total,
        clientes:cliente,
        fecha:formattedDate
      })
      await queryRunner.manager.save(venta)
      for(let item of items){

        const producto = await queryRunner.manager.findOneBy(Producto,{
          id:item.id
        })
        const detalleVenta = queryRunner.manager.create(DetalleVenta,{
          cantidad:item.cantidad,
          precio_unitario:item.precio,
          venta:venta,
          producto:producto
        })

        await queryRunner.manager.save(detalleVenta)
        detalleMov.push({
          cantidad:-item.cantidad,
          idDeposito:2,
          idProducto:item.id
        })
      }

      const movDTO:CreateMovimientoDto={
        tipo:"UPD",
        motivo:"Venta",
        detalle:detalleMov,
        observaciones:""
      }
      await this.movimientoService.create(movDTO)
      await queryRunner.commitTransaction()
      return venta;
    } catch (error) {
      await queryRunner.rollbackTransaction()
      console.log(error)
      throw new InternalServerErrorException(error)
    }finally{
      await queryRunner.release()
    }
  }

  async findAll() {
    return await this.ventasRepository.find({
      select: ['id_venta', 'fecha', 'total'],
      relations: [],
      order: { id_venta: 'DESC' }
    })
  }

  async findOne(id: number) {
    return await this.ventasRepository.findOneBy({id_venta:id})
  }

  update(id: number, updateVentaDto: UpdateVentaDto) {
    return `This action updates a #${id} venta`;
  }

  remove(id: number) {
    return `This action removes a #${id} venta`;
  }





  // Método que ejecuta la lógica de DB para registrar la venta
    private async executeSaleTransaction(
        { total, items, billingInfo }: CapturePaypalSaleDto // Usa el DTO de captura
    ) {
        const queryRunner = this.dataSource.createQueryRunner();
        let detalleMov: detalleMovimientoDto[] = [];

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            // Lógica de Cliente, Venta, DetalleVenta y Movimientos... (Toda tu lógica anterior)
            
            // Lógica de "Find or Create" para Cliente
            let cliente = await queryRunner.manager.findOneBy(Clientes, {
                email: billingInfo.email
            });

            if (!cliente) {
                cliente = queryRunner.manager.create(Clientes, {
                    nombre: billingInfo.name,
                    email: billingInfo.email,
                    apellido: billingInfo.lastName // Asegúrate de manejar el apellido si existe en Clientes
                });
                await queryRunner.manager.save(cliente);
            }

            const venta = queryRunner.manager.create(Venta, {
                total: total,
                clientes: cliente,
            })
            await queryRunner.manager.save(venta)
            
            for (let item of items) {

                const producto = await queryRunner.manager.findOneBy(Producto, {
                    id: item.id
                })
                
                // Validación de producto existente (IMPORTANTE)
                if (!producto) {
                    throw new InternalServerErrorException(`Producto ID ${item.id} no encontrado en inventario.`);
                }
                
                const detalleVenta = queryRunner.manager.create(DetalleVenta, {
                    cantidad: item.cantidad,
                    precio_unitario: item.precio,
                    venta: venta,
                    producto: producto
                })

                await queryRunner.manager.save(detalleVenta)
                detalleMov.push({
                    cantidad: -item.cantidad,
                    idDeposito: 2,
                    idProducto: item.id
                })
            }

            const movDTO: CreateMovimientoDto = {
                tipo: "UPD",
                motivo: "Venta",
                detalle: detalleMov,
                observaciones: "Venta capturada vía PayPal"
            }
            await this.movimientoService.create(movDTO)
            await queryRunner.commitTransaction()
            return venta;
        } catch (error) {
            await queryRunner.rollbackTransaction()
            console.error(error)
            throw new InternalServerErrorException(error.message || 'Error al procesar la venta post-pago.')
        } finally {
            await queryRunner.release()
        }
    }

    // 💡 Método principal llamado desde PaypalController
    async registerSaleFromPaypal(captureDto: CapturePaypalSaleDto) {
        // Aquí podrías agregar lógica de verificación final, ej:
        // 1. Verificar si el total del DTO coincide con el total de la orden de PayPal (si se obtiene)
        return this.executeSaleTransaction(captureDto);
    }
}
