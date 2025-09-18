import { OrdenDeCompra } from 'src/orden-de-compra/entities/orden-de-compra.entity';
import { Producto } from 'src/productos/entities/producto.entity';
export declare class OrdenDeCompraPorProducto {
    id: number;
    producto: Producto;
    ordenDeCompra: OrdenDeCompra;
    cantidad: number;
}
