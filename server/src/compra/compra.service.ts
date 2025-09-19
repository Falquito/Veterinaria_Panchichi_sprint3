import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { Remito } from './entities/compra.entity';
import { OrdenDeCompra } from 'src/orden-de-compra/entities/orden-de-compra.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { Remito_Por_producto } from 'src/entities/Detalle_Remito.entity';

@Injectable()
export class CompraService {

  @InjectDataSource()
  private readonly dataSource:DataSource
  private readonly logger = new Logger('CompraService')
  async create(createCompraDto: CreateCompraDto) {
    const queryRunner =  this.dataSource.createQueryRunner()
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      //Crear remito

      //COnsigo proveedor
      
            const proveedor = await queryRunner.manager.findOneBy(Proveedor,{id_proveedor:createCompraDto.id_proveedor})
            const orden_de_compra = await queryRunner.manager.findOneBy(OrdenDeCompra,{id_oc:createCompraDto.id_oc})
            const fecha = new Date();
      
            const year = fecha.getFullYear() % 100; // últimos 2 dígitos
            const month = fecha.getMonth() + 1; // los meses van de 0 a 11
            const day = fecha.getDate();
      
            const fechaFormateada = `${year.toString().padStart(2,'0')}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
            // const remito = queryRunner.manager.create(Remito,{fecha:fechaFormateada,proveedor:proveedor,ordenDeCompra:orden_de_compra});
            const remito = queryRunner.manager.create(Remito, {
              fecha: fechaFormateada,
              proveedor:proveedor,
              ordenDeCompra:orden_de_compra,
            });
            console.log(remito)
            
            await queryRunner.manager.save(remito)
            // remito.detalles = [];
      
            // for (const item of createCompraDto.productos) {
            //   const producto = await queryRunner.manager.findOneBy(Producto,{id:item.id_producto} );
      
            //   const detalle_remito = queryRunner.manager.create(Remito_Por_producto,{
            //     producto:producto,
            //     cantidad: item.cantidad,
            //     remito:remito,
            //     // ordenDeCompra: orden,
            //   });

             
              
            //   remito.detalles.push(detalle_remito);
            // }

            for (const item of createCompraDto.productos) {
              const detalle = queryRunner.manager.create(Remito_Por_producto, {
                cantidad: item.cantidad,
                producto: { id: item.id_producto }, // solo referencia
                remito: remito,
              });

              await queryRunner.manager.save(detalle);
            }
            console.log(remito)
      
            // await queryRunner.manager.save(remito);
            await queryRunner.commitTransaction();
      
            return remito


    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDbExceptions(error);
    }finally{
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all compra`;
  }

  findOne(id: number) {
    return `This action returns a #${id} compra`;
  }

  update(id: number, updateCompraDto: UpdateCompraDto) {
    return `This action updates a #${id} compra`;
  }

  remove(id: number) {
    return `This action removes a #${id} compra`;
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
