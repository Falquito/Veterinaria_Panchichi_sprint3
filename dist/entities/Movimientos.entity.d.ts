import { Movimientos_Por_Producto } from "./Movimientos_Por_Producto.entity";
export declare class Movimientos {
    id: number;
    tipo: string;
    fecha: string;
    motivo: string;
    observaciones: string;
    movimientosPorProducto: Movimientos_Por_Producto[];
}
