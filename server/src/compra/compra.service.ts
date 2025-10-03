// server/src/compra/compra.service.ts
import { Injectable, InternalServerErrorException, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCompraDto } from './dto/create-compra.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { Remito } from './entities/compra.entity';
import { OrdenDeCompra } from 'src/orden-de-compra/entities/orden-de-compra.entity';
import { Remito_Por_producto } from 'src/entities/Detalle_Remito.entity';

@Injectable()
export class CompraService {

  @InjectDataSource()
  private readonly dataSource:DataSource
  private readonly logger = new Logger('CompraService')

  @InjectRepository(Remito)
  private readonly remitoRepository:Repository<Remito>

  async create(createCompraDto: CreateCompraDto) {
    const { id_proveedor, id_oc, productos, numero_remito, fecha, direccion_entrega } = createCompraDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const ordenDeCompra = await queryRunner.manager.findOne(OrdenDeCompra, { 
            where: { id_oc: id_oc }, 
            relations: ['remito'] 
        });

        if (!ordenDeCompra) {
            throw new NotFoundException(`La Orden de Compra con ID ${id_oc} no existe.`);
        }

        if (ordenDeCompra.remito) {
            throw new BadRequestException(`La Orden de Compra ${id_oc} ya tiene un remito asociado.`);
        }

        const proveedor = await queryRunner.manager.findOneBy(Proveedor, { id_proveedor });
        if (!proveedor) {
            throw new NotFoundException(`El Proveedor con ID ${id_proveedor} no existe.`);
        }
        
        const remito = queryRunner.manager.create(Remito, {
            fecha,
            proveedor: proveedor,
            ordenDeCompra: ordenDeCompra,
            estado: 'Pendiente',
            numero_remito: numero_remito,
            direccion_entrega: direccion_entrega
        });
        
        await queryRunner.manager.save(remito);

        for (const item of productos) {
            const detalle = queryRunner.manager.create(Remito_Por_producto, {
                cantidad: item.cantidad,
                producto: { id: item.id_producto },
                remito: remito,
                unidad_medida: item.unidad_medida
            });
            await queryRunner.manager.save(detalle);
        }
        
        await queryRunner.commitTransaction();
        return remito;

    } catch (error) {
        await queryRunner.rollbackTransaction();
        this.handleDbExceptions(error);
    } finally {
        await queryRunner.release();
    }
  }

  async findAll() {
    return await this.remitoRepository.find({
        order: { id_remito: 'DESC' },
        relations: ['proveedor', 'ordenDeCompra']
    });
  }
  
  async findOne(id: number) {
    const remito = await this.remitoRepository.findOne({
      where: { id_remito: id },
      relations: ['proveedor', 'ordenDeCompra', 'detalles', 'detalles.producto'],
    });

    if (!remito) {
      throw new NotFoundException(`Remito con ID ${id} no encontrado.`);
    }
    return remito;
  }

  // --- MÉTODO CORREGIDO ---
  async findAvailableForFactura() {
    // Esta consulta busca remitos que NO tengan una factura asociada.
    return this.remitoRepository.createQueryBuilder('remito')
      .leftJoinAndSelect('remito.proveedor', 'proveedor')
      .leftJoin('remito.factura', 'factura')
      .where('factura.id IS NULL')
      .getMany();
  }
  async updateEstado(id: number, estado: string) {
        const remito = await this.findOne(id);
        const estadosValidos = ["Pendiente", "Recibido", "Cancelado"];
        if (!estadosValidos.includes(estado)) {
            throw new BadRequestException(`El estado "${estado}" no es válido.`);
        }
        remito.estado = estado;
        return this.remitoRepository.save(remito);
    }
  // --------------------

  private handleDbExceptions (error:any): never {
    this.logger.error(error);
    if (error.code === '23505') {
        throw new BadRequestException(error.detail);
    }
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    }
    throw new InternalServerErrorException("Error inesperado, por favor revise los logs del servidor.");
  }
}