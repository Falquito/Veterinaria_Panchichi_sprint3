import type { DetalleFacturaForm, DetalleRemitoForm, CreateComprobanteDto } from '../types/comprobantes';
import { ERROR_MESSAGES, VALIDATION_RULES, TIPO_COMPROBANTE } from '../hooks/constants';

// Validaciones para formularios de facturas
export const validateFacturaForm = (
  proveedorId: number | '',
  numero: number | '',
  fecha: string,
  idOrdenDeCompra: number | '',
  idDeposito: number | '',
  idTipoFactura: number | '',
  detalles: DetalleFacturaForm[]
): string | null => {
  if (!proveedorId || !numero || !fecha || !idOrdenDeCompra || !idDeposito || !idTipoFactura) {
    return 'Completá proveedor, número, fecha, ID O.C., ID Depósito e ID Tipo Factura.';
  }

  if (detalles.length === 0) {
    return ERROR_MESSAGES.DETALLE_VACIO;
  }

  for (const [i, detalle] of detalles.entries()) {
    if (!detalle.productoId || !detalle.cantidad || !detalle.precio_unitario_compra) {
      return `Detalle #${i + 1}: faltan datos (producto, cantidad o precio).`;
    }
    
    if (Number(detalle.cantidad) <= 0 || Number(detalle.precio_unitario_compra) < 0) {
      return `Detalle #${i + 1}: cantidad debe ser > 0 y precio >= 0.`;
    }
  }

  return null;
};

// Validaciones para formularios de remitos
export const validateRemitoForm = (
  proveedorId: number | '',
  numero: number | '',
  fecha: string,
  idOrdenDeCompra: number | '',
  idDeposito: number | '',
  detalles: DetalleRemitoForm[]
): string | null => {
  if (!proveedorId || !numero || !fecha || !idOrdenDeCompra || !idDeposito) {
    return 'Completá proveedor, número, fecha, ID O.C. e ID Depósito.';
  }

  if (detalles.length === 0) {
    return ERROR_MESSAGES.DETALLE_VACIO;
  }

  for (const [i, detalle] of detalles.entries()) {
    if (!detalle.productoId || !detalle.cantidad) {
      return `Detalle #${i + 1}: faltan datos (producto o cantidad).`;
    }
    
    if (Number(detalle.cantidad) <= 0) {
      return `Detalle #${i + 1}: cantidad debe ser > 0.`;
    }
  }

  return null;
};

// Calcular total de factura
export const calculateFacturaTotal = (detalles: DetalleFacturaForm[]): number => {
  return detalles.reduce((acc, detalle) => {
    const cantidad = Number(detalle.cantidad || 0);
    const precio = Number(detalle.precio_unitario_compra || 0);
    const iva = Number(detalle.iva_porcentaje || 0);
    
    let itemTotal = cantidad * precio;
    if (iva > 0) {
      itemTotal = itemTotal * (1 + iva / 100);
    }
    
    return acc + itemTotal;
  }, 0);
};

// Crear payload para factura
export const createFacturaPayload = (
  proveedorId: number,
  numero: number,
  fecha: string,
  idOrdenDeCompra: number,
  idDeposito: number,
  idTipoFactura: number,
  detalles: DetalleFacturaForm[],
  observaciones: string
): CreateComprobanteDto => {
  const total = calculateFacturaTotal(detalles);
  
  return {
    idTipoDeComprobante: TIPO_COMPROBANTE.FACTURA,
    fecha,
    idProveedor: proveedorId,
    idOrdenDeCompra,
    idDeposito,
    productos: detalles.map((detalle) => ({
      idProducto: Number(detalle.productoId),
      cantidad: Number(detalle.cantidad),
    })),
    observaciones: observaciones?.trim() || undefined,
    numero,
    total,
    idTipoFactura,
  };
};

// Crear payload para remito
export const createRemitoPayload = (
  proveedorId: number,
  numero: number,
  fecha: string,
  idOrdenDeCompra: number,
  idDeposito: number,
  detalles: DetalleRemitoForm[],
  observaciones: string
): CreateComprobanteDto => {
  return {
    idTipoDeComprobante: TIPO_COMPROBANTE.REMITO,
    fecha,
    idProveedor: proveedorId,
    idOrdenDeCompra,
    idDeposito,
    productos: detalles.map((detalle) => ({
      idProducto: Number(detalle.productoId),
      cantidad: Number(detalle.cantidad),
    })),
    observaciones: observaciones?.trim() || undefined,
    numero,
    total: 0, // Los remitos no tienen total
  };
};

// Función para formatear fecha para input date
export const formatDateForInput = (): string => {
  return new Date().toISOString().slice(0, 10);
};

// Función para hacer POST a la API
export const submitComprobante = async (payload: CreateComprobanteDto): Promise<void> => {
  const response = await fetch('http://localhost:3000/comprobante', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `Error HTTP ${response.status}`);
  }
};