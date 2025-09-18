import { OrdenDeCompraPorProducto } from "src/entities/Orden_de_compra_Por_Producto.entity";
import { Proveedor } from "src/proveedores/entities/proveedor.entity";
export declare class OrdenDeCompra {
    id_oc: number;
    fecha: string;
    total: number;
    productos: OrdenDeCompraPorProducto[];
    proveedor: Proveedor;
}
