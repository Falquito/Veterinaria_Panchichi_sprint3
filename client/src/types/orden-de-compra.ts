// src/features/orden-compra/types.ts
export interface Proveedor {
  id_proveedor: number;
  nombre: string;
  cuit?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  descripcion?: string;
  categoria?: string;
}

export interface ProductoOrden {
  id?: number;
  producto: Producto | null;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface CreateOrdenDto {
  proveedorId: number;
  productos: { productoId: number; cantidad: number }[];
}

export interface OrdenDeCompra {
  id_oc: number;
  fecha: string;
  total: string;
  productos: {
    id: number;
    cantidad: number;
    producto: {
      id: number;
      nombre: string;
      descripcion: string;
      precio: number;
      categoria?: { nombre: string } | null;
    };
  }[];
  proveedor: {
    id_proveedor: number;
    nombre: string;
    cuit?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
  };
}
