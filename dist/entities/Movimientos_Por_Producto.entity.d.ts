import { Movimientos } from "./Movimientos.entity";
import { Producto } from "src/productos/entities/producto.entity";
export declare class Movimientos_Por_Producto {
    id: number;
    cantidad: number;
    movimientos: Movimientos;
    productos: Producto;
    id_deposito: number;
}
