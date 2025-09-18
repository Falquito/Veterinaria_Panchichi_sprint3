import { Deposito } from "src/depositos/entities/deposito.entity";
import { Producto } from "src/productos/entities/producto.entity";
export declare class Producto_Por_Deposito {
    id: number;
    producto: Producto;
    deposito: Deposito;
    stock: number;
}
