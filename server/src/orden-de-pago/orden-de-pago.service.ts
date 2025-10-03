import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrdenDePagoDto } from './dto/create-orden-de-pago.dto';
import { UpdateOrdenDePagoDto } from './dto/update-orden-de-pago.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Comprobante } from 'src/comprobante/entities/comprobante.entity';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { OrdenDePago } from './entities/orden-de-pago.entity';
import { DetalleOrdenDePago } from 'src/entities/detalle-orden-de-pago.entity';
import { Factura } from 'src/facturas/entities/factura.entity';

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
    const { fecha, formaDePago, facturas: facturasDto, idProveedor } = createOrdenDePagoDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const proveedor = await queryRunner.manager.findOneBy(Proveedor, { id_proveedor: idProveedor });
      if (!proveedor) throw new NotFoundException(`Proveedor con ID ${idProveedor} no encontrado.`);

      const idsFacturas = facturasDto.map(f => f.idFactura);
      if (idsFacturas.length === 0) throw new BadRequestException('Debe seleccionar al menos una factura.');

      const facturas = await queryRunner.manager.find(Factura, { where: { id: In(idsFacturas) } });

      let montoTotal = 0;
      for (const factura of facturas) {
        if (factura.estado !== 'PENDIENTE') throw new BadRequestException(`La factura #${factura.numero} no está en estado PENDIENTE.`);
        montoTotal += Number(factura.total);
      }

      const ordenDePago = queryRunner.manager.create(OrdenDePago, { fecha, formaDePago, montoTotal, proveedor, estado: 'Pagado' });
      await queryRunner.manager.save(ordenDePago);

      for (const factura of facturas) {
        const detalle = queryRunner.manager.create(DetalleOrdenDePago, { factura, ordenDePago });
        await queryRunner.manager.save(detalle);
        factura.estado = 'PAGADO'; // Cambiamos el estado de la factura
        await queryRunner.manager.save(factura);
      }

      await queryRunner.commitTransaction();
      return ordenDePago;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.orderDePagoRepository.find()
  }

  
}
