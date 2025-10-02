import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToOne } from 'typeorm';
import { Factura } from './factura.entity';
import { Producto } from 'src/productos/entities/producto.entity';

@Entity('facturas_detalles')
export class DetalleFactura {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @ManyToOne(() => Factura, (f) => f.detalles, { onDelete: 'CASCADE' })
  factura: Factura;

  @ManyToOne(() => Producto, { eager: true })
  producto: Producto;

  @Column({ type: 'int' })
  cantidad: number;

  //precio unitario del producto
  @Column({ type: 'float' })
  precio_unitario_compra: number;

  @Column({ type: 'float', default: 0 })
  iva_porcentaje: number;

  @Column({ type: 'float', default: 0 })
  subtotal: number;


}
