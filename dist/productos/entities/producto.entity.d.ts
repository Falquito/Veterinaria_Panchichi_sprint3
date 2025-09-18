import { Categoria } from "src/categorias/entities/categoria.entity";
import { Movimientos_Por_Producto } from "src/entities/Movimientos_Por_Producto.entity";
import { OrdenDeCompraPorProducto } from "src/entities/Orden_de_compra_Por_Producto.entity";
import { Producto_Por_Deposito } from "src/entities/Producto_Por_Deposito.entity";
export declare class Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    activo: boolean;
    ImagenURL: string;
    categoria: Categoria;
    productosPorDeposito: Producto_Por_Deposito[];
    fecha_vencimiento: string;
    nro_lote: number;
    movimientosPorProducto: Movimientos_Por_Producto[];
    proveedoresId: {
        idProveedor: number;
    }[];
    ordenesPorProducto: OrdenDeCompraPorProducto[];
}
