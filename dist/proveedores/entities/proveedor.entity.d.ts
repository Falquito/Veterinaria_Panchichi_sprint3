import { OrdenDeCompra } from 'src/orden-de-compra/entities/orden-de-compra.entity';
export declare class Proveedor {
    id_proveedor: number;
    nombre: string;
    cuit: string;
    email: string;
    telefono: string;
    direccion: string;
    activo: boolean;
    ordenes: OrdenDeCompra[];
}
