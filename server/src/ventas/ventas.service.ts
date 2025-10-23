import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { Clientes } from 'src/entities/Cliente.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectDataSource()
    private readonly dataSource:DataSource
  ){}

  async create(createVentaDto: CreateVentaDto) {

    const {total,items,billingInfo,cardInfo} = createVentaDto
    const queryRunner = this.dataSource.createQueryRunner()

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

      const venta = queryRunner.manager.create(Venta,{
        total:total,
        clientes:cliente
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
      }
      await queryRunner.commitTransaction()
      return venta;
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException()
    }finally{
      await queryRunner.release()
    }
  }

  findAll() {
    return `This action returns all ventas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} venta`;
  }

  update(id: number, updateVentaDto: UpdateVentaDto) {
    return `This action updates a #${id} venta`;
  }

  remove(id: number) {
    return `This action removes a #${id} venta`;
  }
}
