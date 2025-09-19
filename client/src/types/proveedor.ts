export interface Proveedor {
    id_proveedor: number;
    nombre: string;
    cuit?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    activo: boolean;
}

export interface NewProveedorPayload {
    nombre: string;
    cuit?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
}

export type UpdateProveedorPayload = Partial<NewProveedorPayload>;

export interface ProveedoresResponse {
    items: Proveedor[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}