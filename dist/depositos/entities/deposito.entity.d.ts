import { Producto_Por_Deposito } from "src/entities/Producto_Por_Deposito.entity";
export declare class Deposito {
    id_deposito: number;
    nombre: string;
    direccion: string;
    activo: boolean;
    productosPorDeposito: Producto_Por_Deposito[];
}
