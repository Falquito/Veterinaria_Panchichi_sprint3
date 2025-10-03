// client/src/types/comprobantes.ts

export interface ProveedorRef {
    id_proveedor: number;
    nombre: string;
    cuit?: string;
    email?: string;
    direccion?: string; // <-- CAMBIO AQUÍ
}

export interface ProductoRef {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
}

export interface OrdenDeCompra {
    id_oc: number;
    fecha: string;
    total: number;
    proveedor: ProveedorRef;
    productos: {
        id: number;
        cantidad: number;
        producto: ProductoRef;
    }[];
}

export interface Remito {
    id_remito: number;
    numero_remito: string;
    fecha: string;
    estado: string;
    proveedor: ProveedorRef;
    ordenDeCompra: { id_oc: number };
}

export interface Factura {
    id: number;
    numero: string;
    fecha: string;
    total: number;
    estado: string;
    tipo?: string; // <-- CAMBIO AQUÍ
    proveedor: ProveedorRef;
    remito: { id_remito: number, numero_remito: string };
}

// Interfaces para las vistas de detalle
export interface DetalleRemito extends Remito {
    direccion_entrega: string;
    detalles: {
        cantidad: number;
        unidad_medida: string;
        producto: ProductoRef;
    }[];
}

export interface DetalleFactura extends Factura {
    total_neto: number;
    iva: number;
    observaciones?: string;
    detalles: {
        id: number;
        cantidad: number;
        precio_unitario_compra: number;
        iva_porcentaje: number;
        subtotal: number;
        producto: ProductoRef;
    }[];
}