// tipos unificados para formulario de comprobantes (facturas y remitos)

import type { OrdenDeCompra } from './orden-de-compra';
import type { Depot } from './depot';

// Tipos principales mantenidos de tu estructura
export type CategoriaRef =
  | string
  | { id: number; nombre: string; descripcion?: string; createdAt?: string; updatedAt?: string };

export interface ProductDeposito {
  idDeposito: number;
  nombreDeposito: string;
  stock: number;
}

export interface Product {
  id: number;
  imagen: string;
  nombre: string;
  categoria: CategoriaRef;  
  precio: number;
  stock: number;
  deposito: string;
  descripcion: string;
  activo?: boolean;
  estado?: { label: string; color: string };
  depositos?: ProductDeposito[];
}


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

// NUEVO: Tipos de comprobante
export type TipoComprobante = 'remito' | 'factura';
export interface ProductoRemito {
  producto: Product;
  cantidad: number;
}

// NUEVO: Formulario unificado para ambos tipos de comprobante
export interface ComprobanteFormData {
  // Tipo de comprobante
  tipoComprobante: TipoComprobante | null;
  
  // Información común
  proveedor: Proveedor | null;
  fecha: string;
  observaciones: string;
  
  // Campos específicos de FACTURA (mantiene flujo original)
  factura: {
    numero: number | '';
    idTipoFactura: number | '';
    ivaPorcentaje: number | '';
  };
  
  // Campos específicos de REMITO (ACTUALIZADO con productos)
  remito: {
    productos: ProductoRemito[]; // ← NUEVO campo para productos manuales
    direccion_entrega: string;
  };
  
  // Campos para facturas (mantener compatibilidad)
  ordenDeCompra: OrdenDeCompra | null;
  deposito: Depot | null;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface CreateComprobanteDto {
  idTipoDeComprobante: 1 | 2; // 1 = remito, 2 = factura
  fecha: string;
  idProveedor: number;
  idOrdenDeCompra: number;
  idDeposito: number;
  productos: Array<{
    idProducto: number;
    cantidad: number;
  }>;
  observaciones?: string;
  
  // Campos específicos de factura
  numero?: number;
  total?: number;
  idTipoFactura?: number;
  
  // Campos específicos de remito
  direccion_entrega?: string;
}

export interface Remito {
  id_remito: number;
  fecha: string;
  estado: string;
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
  tipoDeComprobante: {
    id: number;
    tipo: string;
  };
  ordenDeCompra: {
    id_oc: number;
  };
  detalles: [{
    id: number;
    cantidad: number;
    producto: {
      id: number;
      nombre: string;
    };
  }];
  deposito: {
    id_deposito: number;
    nombre: string;
  };
}

export type TabType = 'remitos' | 'facturas';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ============================================
// TIPOS DE COMPATIBILIDAD - NO ELIMINAR
// ============================================
// Estos tipos mantienen compatibilidad con código existente

export interface DetalleFacturaForm {
  idProducto: number | '';
  cantidad: number | '';
  precio: number | '';
}

export interface DetalleRemitoForm {
  idProducto: number | '';
  cantidad: number | '';
}

// Alias para mantener compatibilidad con FacturaFormData
export interface FacturaFormData {
  proveedor: Proveedor | null;
  ordenDeCompra: OrdenDeCompra | null;
  deposito: Depot | null;
  numero: number | '';
  fecha: string;
  idTipoFactura: number | '';
  observaciones: string;
  ivaPorcentaje: number | '';
}

// Alias para mantener compatibilidad con CreateFacturaDto
export interface CreateFacturaDto {
  idTipoDeComprobante: 2;
  fecha: string;
  idProveedor: number;
  idOrdenDeCompra: number;
  idDeposito: number;
  productos: Array<{
    idProducto: number;
    cantidad: number;
  }>;
  observaciones?: string;
  numero: number;
  total: number;
  idTipoFactura: number;
}

