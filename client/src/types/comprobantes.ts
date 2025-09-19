export interface Remito {
    id_remito: number;
    fecha: string;
    proveedor: {
        id_proveedor: number;
        nombre: string;
    };
    ordenDeCompra?: { // Se hizo opcional para mayor seguridad
        id_oc: number;
    };
}

export interface Factura {
    id: number;
    numero: string;
    fecha: string;
    total: number;
    proveedor: {
        id_proveedor: number;
        nombre: string;
    };
}