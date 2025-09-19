import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Factura } from './entities/factura.entity';
import { DetalleFactura } from './entities/detalle_factura.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { Remito } from 'src/compra/entities/compra.entity';

@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(Factura) private readonly repo: Repository<Factura>,
    @InjectRepository(DetalleFactura) private readonly detRepo: Repository<DetalleFactura>,
    @InjectRepository(Proveedor) private readonly provRepo: Repository<Proveedor>,
    @InjectRepository(Producto) private readonly prodRepo: Repository<Producto>,
    @InjectRepository(Remito) private readonly remitoRepo: Repository<Remito>
  ) {}

  async create(dto: CreateFacturaDto) {

    const prov = await this.provRepo.findOne({ where: { id_proveedor: dto.proveedorId } });
    const remito = await this.remitoRepo.findOneBy({id_remito:dto.idRemito})
    if (!prov) throw new BadRequestException('Proveedor inválido');

    const productos = await this.prodRepo.findBy({ id: In(dto.detalles.map(d => d.productoId)) });
    if (productos.length !== dto.detalles.length) throw new BadRequestException('Producto inválido en detalle');

    const factura = this.repo.create({
      proveedor: prov,
      numero: dto.numero,
      fecha: dto.fecha,
      tipo: dto.tipo,
      observaciones: dto.observaciones,
      remito:remito,
      detalles: dto.detalles.map(d => {
        const prod = productos.find(p => p.id === d.productoId)!;
        const subtotal = d.cantidad * d.precio_unitario_compra;
        return this.detRepo.create({
          producto: prod,
          cantidad: d.cantidad,
          precio_unitario_compra: d.precio_unitario_compra,
          iva_porcentaje: d.iva_porcentaje ?? 0,
          subtotal,
        });
      }),
    });

    // totales
    factura.total_neto = factura.detalles.reduce((acc, it) => acc + it.subtotal, 0);
    const ivaTotal = factura.detalles.reduce((acc, it) => acc + (it.subtotal * (it.iva_porcentaje ?? 0)) / 100, 0);
    factura.iva = ivaTotal;
    factura.total = factura.total_neto + factura.iva;

    return await this.repo.save(factura);
  }

  findAll() {
    return this.repo.find({ order: { fecha: 'DESC' } });
  }

  async findOne(id: number) {
    const fac = await this.repo.findOne({ where: { id }, relations: ['detalles'] });
    if (!fac) throw new NotFoundException('Error: Factura no encontrada');
    return fac;
  }
}
