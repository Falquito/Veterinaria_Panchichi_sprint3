export interface Remito {
    id_remito: number;
    fecha: string;
    estado: string; // <-- Añadido
    proveedor: {
        id_proveedor: number;
        nombre: string;
    };
    ordenDeCompra?: {
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