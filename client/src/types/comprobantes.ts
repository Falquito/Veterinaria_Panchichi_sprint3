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
    tipoDeComprobante:{
        id:number,
        tipo:string;
    }
    ordenDeCompra:{
        id_oc:number
    }
    detalles:[{
        id:number,
        cantidad:number,
        producto:{
            id:number,
            nombre:string
        }
    }]
    deposito:{
        id_deposito:number,
        nombre:string;
    }
}