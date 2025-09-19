import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';
import { Factura } from './entities/factura.entity';
import { DetalleFactura } from './entities/detalle_factura.entity';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { Remito } from 'src/compra/entities/compra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, DetalleFactura, Proveedor, Producto,Remito])],
  controllers: [FacturasController],
  providers: [FacturasService],
})
export class FacturasModule {}
