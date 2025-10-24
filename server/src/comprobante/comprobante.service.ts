import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateComprobanteDto } from './dto/create-comprobante.dto';
import { UpdateComprobanteDto } from './dto/update-comprobante.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { OrdenDeCompra } from 'src/orden-de-compra/entities/orden-de-compra.entity';
import { Comprobante } from './entities/comprobante.entity';
import { Deposito } from 'src/depositos/entities/deposito.entity';
import { TipoDeComprobante } from 'src/entities/TipoDeComprobante.entity';
import { DetalleComprobante } from 'src/entities/DetalleComprobante.entity';
import { TipoDeFactura } from 'src/entities/TipoDeFactura.entity';

@Injectable()
export class ComprobanteService {
  @InjectDataSource()
  private readonly dataSource:DataSource;
  @InjectRepository(Comprobante)
  private readonly comprobanteRepository:Repository<Comprobante>

  private readonly logger:Logger


  async create(createComprobanteDto: CreateComprobanteDto) {

      const {fecha, idOrdenDeCompra,idProveedor,idTipoDeComprobante,idDeposito,direccion_entrega,idTipoFactura,numero,observaciones,productos,total} = createComprobanteDto
      const queryRunner =  this.dataSource.createQueryRunner()
      try {
        await queryRunner.connect()
        await queryRunner.startTransaction()
  
        //Crear comprobante
        
              const proveedor = await queryRunner.manager.findOneBy(Proveedor,{id_proveedor:idProveedor})

              const orden_de_compra = await queryRunner.manager.findOneBy(OrdenDeCompra,{id_oc:idOrdenDeCompra})

              const deposito = await queryRunner.manager.findOneBy(Deposito,{id_deposito:idDeposito})

              const tipoDeComprobante = await queryRunner.manager.findOneBy(TipoDeComprobante,{id:idTipoDeComprobante})

              const tipoDeFactura = await queryRunner.manager.findOneBy(TipoDeFactura,{
                id:idTipoFactura
              })

              const comprobante = queryRunner.manager.create(Comprobante, {
                fecha: fecha,
                proveedor:proveedor,
                ordenDeCompra:orden_de_compra,
                deposito:deposito,
                tipoDeComprobante:tipoDeComprobante,
                direccion_entrega,
                numero:numero,
                observaciones,
                tipoFactura:tipoDeComprobante.tipo.toLowerCase()==="factura"?tipoDeFactura:null,
                total:tipoDeComprobante.tipo.toLowerCase()==="factura"?total:0
              });
              console.log(comprobante)
              
              await queryRunner.manager.save(comprobante)
            
              for (const item of createComprobanteDto.productos) {
                const detalle = queryRunner.manager.create(DetalleComprobante, {
                  cantidad: item.cantidad,
                  producto: { id: item.idProducto },
                  comprobante:comprobante,
                });
  
                await queryRunner.manager.save(detalle);
              }
              console.log(comprobante)
        
              // await queryRunner.manager.save(comprobante);
              await queryRunner.commitTransaction();
        
              return comprobante
  
  
      } catch (error) {
        await queryRunner.rollbackTransaction();
        this.handleDbExceptions(error);
      }finally{
        await queryRunner.release();
      }
    }

  async findAll() {
    return await this.comprobanteRepository.find();
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
