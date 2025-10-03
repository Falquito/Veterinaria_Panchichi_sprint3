// server/src/compra/entities/compra.entity.ts
import { Remito_Por_producto } from "src/entities/Detalle_Remito.entity";
import { Factura } from "src/facturas/entities/factura.entity";
import { OrdenDeCompra } from "src/orden-de-compra/entities/orden-de-compra.entity";
import { Proveedor } from "src/proveedores/entities/proveedor.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Remito {
    @PrimaryGeneratedColumn("identity")
    id_remito: number;

    @Column({ type: "varchar", length: 50, unique: true, nullable: true })
    numero_remito: string;

    // --- CORRECCIÓN FINAL ---
    // Apuntamos al nombre de columna que existe realmente en tu base de datos.
    @ManyToOne(() => Proveedor, (proveedor) => proveedor.remitos, { eager: true })
    @JoinColumn({ name: "idProveedorIdProveedor" }) 
    proveedor: Proveedor;
    // --- FIN DE LA CORRECCIÓN ---

    @OneToOne(() => OrdenDeCompra, (ordenDeCompra) => ordenDeCompra.remito)
    @JoinColumn()
    ordenDeCompra: OrdenDeCompra;

    @Column({ type: "text" })
    fecha: string;

    @OneToMany(() => Remito_Por_producto, (detalle_remito) => detalle_remito.remito, { cascade: true, eager: true })
    detalles: Remito_Por_producto[]

    @OneToOne(() => Factura, (factura) => factura.remito)
    factura: Factura;

    @Column({ type: "text", nullable: true })
    direccion_entrega: string;

    @Column({ type: "varchar", length: 20, default: "Pendiente" })
    estado: string; 
}