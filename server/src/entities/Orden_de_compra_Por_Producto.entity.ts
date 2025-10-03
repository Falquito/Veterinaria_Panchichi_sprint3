// orden-de-compra-por-producto.entity.ts
import { OrdenDeCompra} from 'src/orden-de-compra/entities/orden-de-compra.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { IsNumber, IsPositive } from 'class-validator';



@Entity()
export class OrdenDeCompraPorProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Producto, p => p.ordenesPorProducto, { eager: true })
  producto: Producto;

  @ManyToOne(() => OrdenDeCompra, o => o.productos)
  ordenDeCompra: OrdenDeCompra;

  @Column()
  cantidad: number;

   @Column('decimal', { precision: 10, scale: 2, nullable: true })
  precioUnitario: number;
}
