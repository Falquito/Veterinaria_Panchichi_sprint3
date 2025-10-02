import { Injectable, InternalServerErrorException, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCompraDto } from './dto/create-compra.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { Remito } from './entities/compra.entity';
import { OrdenDeCompra } from 'src/orden-de-compra/entities/orden-de-compra.entity';
import { Remito_Por_producto } from 'src/entities/Detalle_Remito.entity';
import { Movimientos } from 'src/entities/Movimientos.entity';
import { Movimientos_Por_Producto } from 'src/entities/Movimientos_Por_Producto.entity';
import { Producto_Por_Deposito } from 'src/entities/Producto_Por_Deposito.entity';
import { Deposito } from 'src/depositos/entities/deposito.entity';

@Injectable()
export class CompraService {

  @InjectDataSource()
  private readonly dataSource:DataSource
  private readonly logger = new Logger('CompraService')

  @InjectRepository(Remito)
  private readonly remitoRepository:Repository<Remito>
  
  async create(createCompraDto: CreateCompraDto) {
    const queryRunner =  this.dataSource.createQueryRunner()
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()
      
      const proveedor = await queryRunner.manager.findOneBy(Proveedor,{id_proveedor:createCompraDto.id_proveedor})
      const orden_de_compra = await queryRunner.manager.findOneBy(OrdenDeCompra,{id_oc:createCompraDto.id_oc})
      const fecha = new Date();

      const fechaFormateada = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
      
      const remito = queryRunner.manager.create(Remito, {
        fecha: fechaFormateada,
        proveedor:proveedor,
        ordenDeCompra:orden_de_compra,
      });
      
      await queryRunner.manager.save(remito)

      for (const item of createCompraDto.productos) {
        const detalle = queryRunner.manager.create(Remito_Por_producto, {
          cantidad: item.cantidad,
          producto: { id: item.id_producto },
          remito: remito,
        });
        await queryRunner.manager.save(detalle);
      }
      
      await queryRunner.commitTransaction();

      return remito

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDbExceptions(error);
    }finally{
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      const remitos = await this.remitoRepository.find({
        order: { id_remito: 'DESC' }
      });
      return remitos;
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async confirmarRecepcion(id: number, depositoId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const remito = await queryRunner.manager.findOne(Remito, {
            where: { id_remito: id },
            relations: ['detalles', 'detalles.producto'],
        });

        if (!remito) throw new NotFoundException(`Remito con id ${id} no encontrado.`);
        if (remito.estado === 'Recibido') throw new BadRequestException('Este remito ya fue procesado.');
        
        const deposito = await queryRunner.manager.findOneBy(Deposito, { id_deposito: depositoId });
        if (!deposito) throw new NotFoundException(`Depósito con id ${depositoId} no encontrado.`);

        const movimiento = queryRunner.manager.create(Movimientos, {
            tipo: 'INS',
            fecha: new Date().toISOString(),
            motivo: `Recepción de Remito #${id}`,
            observaciones: '',
        });
        await queryRunner.manager.save(movimiento);

        for (const detalle of remito.detalles) {
            // 1. Registrar el movimiento de entrada
            const movProducto = queryRunner.manager.create(Movimientos_Por_Producto, {
                cantidad: detalle.cantidad,
                movimientos: movimiento,
                productos: detalle.producto,
                id_deposito: depositoId
            });
            await queryRunner.manager.save(movProducto);

            // 2. Actualizar (o crear) el stock en Producto_Por_Deposito
            let stockRegistro = await queryRunner.manager.findOne(Producto_Por_Deposito, {
                where: { producto: { id: detalle.producto.id }, deposito: { id_deposito: depositoId } },
                relations: ['producto', 'deposito']
            });

            if (stockRegistro) {
                stockRegistro.stock += detalle.cantidad;
            } else {
                stockRegistro = queryRunner.manager.create(Producto_Por_Deposito, {
                    producto: detalle.producto,
                    deposito: deposito,
                    stock: detalle.cantidad
                });
            }
            await queryRunner.manager.save(stockRegistro);
        }

        remito.estado = 'Recibido';
        await queryRunner.manager.save(remito);

        await queryRunner.commitTransaction();
        return remito;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        this.handleDbExceptions(error);
    } finally {
        await queryRunner.release();
    }
  }

  private handleDbExceptions (error:any){
        console.log(error);
                if (error.code === '42703') {
                    this.logger.error("El error es: " + error.driverError + " te aconsejo: " + error.hint);
                    throw new InternalServerErrorException("Error inesperado en el servidor, por favor revise los logs.");
                }
                this.logger.error(error);
                throw new InternalServerErrorException("Unexpected errir, check server logs");
      }
}