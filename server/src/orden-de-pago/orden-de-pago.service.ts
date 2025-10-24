import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrdenDePagoDto } from './dto/create-orden-de-pago.dto';
import { UpdateOrdenDePagoDto } from './dto/update-orden-de-pago.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Comprobante } from 'src/comprobante/entities/comprobante.entity';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { OrdenDePago } from './entities/orden-de-pago.entity';
import { DetalleOrdenDePago } from 'src/entities/detalle-orden-de-pago.entity';

@Injectable()
export class OrdenDePagoService {
  constructor(
    @InjectDataSource()
    private readonly dataSource:DataSource,
    @InjectRepository(OrdenDePago)
    private readonly orderDePagoRepository:Repository<OrdenDePago>
    
  ){}
  private readonly logger:Logger = new Logger("Orden de pago service")
  
  async create(createOrdenDePagoDto: CreateOrdenDePagoDto) {
    const {fecha,formaDePago,comprobantes,idProveedor,montoTotal} = createOrdenDePagoDto
    const queryRunner = this.dataSource.createQueryRunner()  
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      const proveedor = await queryRunner.manager.findOneBy(Proveedor,{id_proveedor:idProveedor})
      if(!proveedor){
        throw new NotFoundException(`No se encontro el proveedor con el id: ${idProveedor}`)
      }

      const ordenDePago = queryRunner.manager.create(OrdenDePago,{
        fecha,
        formaDePago,
        montoTotal,
        proveedor
      })

      await queryRunner.manager.save(ordenDePago)
      
      for(const {idComprobante} of comprobantes){
        const comprobante = await queryRunner.manager.findOneBy(Comprobante,{
            id:idComprobante
          })
        if(!comprobante){
          throw new NotFoundException(`No se encontro el comprobante con el id: ${idComprobante}`)
        }
        
        const detalleOrdenDePago = queryRunner.manager.create(DetalleOrdenDePago,{
          comprobante: comprobante,
          ordenDePago:ordenDePago
        })

        await queryRunner.manager.save(detalleOrdenDePago)

        // 🔧 AGREGAR ESTO: Marcar comprobante como usado
        await queryRunner.manager.update(Comprobante, 
          { id: idComprobante }, 
          { estado: 'usado' }
        )
      }

      await queryRunner.commitTransaction()
      return ordenDePago;

    } catch (error) {
      await queryRunner.rollbackTransaction()
      
      if (error instanceof Error) {
        throw error;
      }

      this.logger.error(error);
      throw new InternalServerErrorException('Error creando la orden de pago');
      
    }finally{
      await queryRunner.release()
    }
}

  async findAll() {
    return await this.orderDePagoRepository.find()
  }

  
}
