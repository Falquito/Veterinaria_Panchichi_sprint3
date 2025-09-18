import { Producto } from "src/productos/entities/producto.entity";
export declare class Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
    createdat: Date;
    updatedat: Date;
    productos: Producto[];
    activo: boolean;
}
