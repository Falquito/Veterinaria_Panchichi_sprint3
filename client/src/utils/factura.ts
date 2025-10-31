// Utils actualizadas para remitos con ProductSelector

import type { ComprobanteFormData, CreateComprobanteDto, ProductoRemito } from '../types/comprobantes';
import { ERROR_MESSAGES, VALIDATION_RULES, TIPO_COMPROBANTE } from '../constants/factura-constants';

// Formatear fecha para input
export const formatDateForInput = (date?: Date): string => {
  const d = date || new Date();
  return d.toISOString().split('T')[0];
};

// Validar formulario según el tipo de comprobante
export const validateComprobanteForm = (formData: ComprobanteFormData): string | null => {
  console.log('🔍 Validando comprobante:', formData.tipoComprobante, formData);
  
  // Validaciones comunes
  if (!formData.tipoComprobante) {
    console.log('❌ Error: Tipo de comprobante faltante');
    return ERROR_MESSAGES.TIPO_REQUERIDO;
  }

  if (!formData.proveedor) {
    console.log('❌ Error: Proveedor faltante');
    return ERROR_MESSAGES.PROVEEDOR_REQUERIDO;
  }

  if (!formData.fecha) {
    console.log('❌ Error: Fecha faltante');
    return ERROR_MESSAGES.FECHA_REQUERIDA;
  }

  // Validaciones específicas por tipo
  if (formData.tipoComprobante === 'factura') {
    console.log('🔍 Validando campos de factura...');
    return validateFacturaFields(formData);
  } else if (formData.tipoComprobante === 'remito') {
    console.log('🔍 Validando campos de remito...');
    return validateRemitoFields(formData);
  }

  return null;
};

// Validaciones específicas de factura
const validateFacturaFields = (formData: ComprobanteFormData): string | null => {
  // Validar orden de compra
  if (!formData.ordenDeCompra) {
    console.log('❌ Error: Orden de compra faltante');
    return ERROR_MESSAGES.ORDEN_REQUERIDA;
  }

  // Validar depósito
  if (!formData.deposito) {
    console.log('❌ Error: Depósito faltante');
    return ERROR_MESSAGES.DEPOSITO_REQUERIDO;
  }

  // Validar productos de la orden
  if (!formData.ordenDeCompra.productos || formData.ordenDeCompra.productos.length === 0) {
    console.log('❌ Error: Productos faltantes en orden');
    return ERROR_MESSAGES.ORDEN_SIN_PRODUCTOS;
  }

  // Validar número - debe ser un número positivo
  const numeroValue = formData.factura.numero;
  if (numeroValue === '' || numeroValue === null || numeroValue === undefined || Number(numeroValue) <= 0 || !Number.isInteger(Number(numeroValue))) {
    return ERROR_MESSAGES.NUMERO_REQUERIDO;
  }

  const tipoFacturaValue = formData.factura.idTipoFactura;
  if (tipoFacturaValue === '' || tipoFacturaValue === null || tipoFacturaValue === undefined || Number(tipoFacturaValue) < VALIDATION_RULES.MIN_ID) {
    return ERROR_MESSAGES.TIPO_FACTURA_REQUERIDO;
  }

  const ivaValue = formData.factura.ivaPorcentaje;
  if (ivaValue !== '' && ivaValue !== null && ivaValue !== undefined && Number(ivaValue) < 0) {
    return ERROR_MESSAGES.IVA_INVALIDO;
  }

  return null;
};

// Validaciones específicas de remito (ACTUALIZADO)
const validateRemitoFields = (formData: ComprobanteFormData): string | null => {
  console.log('🚚 Validando productos remito:', formData.remito.productos);
  
  // Validar que tenga productos
  if (!formData.remito.productos || formData.remito.productos.length === 0) {
    console.log('❌ Error: Productos faltantes en remito');
    return ERROR_MESSAGES.PRODUCTOS_REMITO_REQUERIDOS;
  }

  // Validar que todos los productos tengan cantidad válida
  for (const item of formData.remito.productos) {
    if (!item.cantidad || item.cantidad <= 0) {
      console.log('❌ Error: Cantidad inválida para producto:', item.producto.nombre);
      return ERROR_MESSAGES.CANTIDAD_INVALIDA;
    }
  }

  console.log('🚚 Validando dirección de entrega:', formData.remito.direccion_entrega);
  
  if (!formData.remito.direccion_entrega || !formData.remito.direccion_entrega.trim()) {
    console.log('❌ Error: Dirección de entrega vacía');
    return ERROR_MESSAGES.DIRECCION_ENTREGA_REQUERIDA;
  }

  console.log('✅ Remito válido');
  return null;
};

// Calcular subtotal según el tipo de comprobante
export const calcularSubtotalOrden = (formData: ComprobanteFormData): number => {
  if (formData.tipoComprobante === 'factura') {
    // Factura: calcular desde orden de compra
    if (!formData.ordenDeCompra?.productos) return 0;
    
    return formData.ordenDeCompra.productos.reduce((total, item) => {
      const subtotal = item.cantidad * item.producto.precio;
      return total + subtotal;
    }, 0);
  } else {
    // Remito: NO calcular precios
    return 0;
  }
};

// Calcular IVA (solo para facturas)
export const calcularIVA = (formData: ComprobanteFormData): number => {
  if (formData.tipoComprobante !== 'factura') return 0;
  
  const subtotal = calcularSubtotalOrden(formData);
  const ivaPorcentaje = Number(formData.factura.ivaPorcentaje || 0);
  return subtotal * (ivaPorcentaje / 100);
};

// Calcular total final según el tipo
export const calcularTotalOrden = (formData: ComprobanteFormData): number => {
  if (formData.tipoComprobante === 'factura') {
    const subtotal = calcularSubtotalOrden(formData);
    const iva = calcularIVA(formData);
    return subtotal + iva;
  }
  
  // Los remitos no calculan total con precios
  return 0;
};

// Crear payload para enviar al backend (ACTUALIZADO)
export const createComprobantePayload = (formData: ComprobanteFormData): CreateComprobanteDto => {
  if (!formData.proveedor || !formData.tipoComprobante) {
    throw new Error('Datos incompletos para crear el comprobante');
  }

  const basePayload = {
    idTipoDeComprobante: formData.tipoComprobante === 'factura' ? TIPO_COMPROBANTE.FACTURA : TIPO_COMPROBANTE.REMITO,
    fecha: formData.fecha,
    idProveedor: formData.proveedor.id_proveedor,
    ...(formData.observaciones && { observaciones: formData.observaciones }), // Solo agregar si tiene valor
  };

  // Agregar campos específicos según el tipo
  if (formData.tipoComprobante === 'factura') {
    // FACTURA: Flujo original con orden de compra
    if (!formData.ordenDeCompra || !formData.deposito) {
      throw new Error('Datos incompletos para crear la factura');
    }

    const productos = formData.ordenDeCompra.productos.map(item => ({
      idProducto: item.producto.id,
      cantidad: item.cantidad
    }));

    const total = calcularTotalOrden(formData);
    
    return {
      ...basePayload,
      idOrdenDeCompra: formData.ordenDeCompra.id_oc,
      idDeposito: formData.deposito.id_deposito,
      productos,
      numero: Number(formData.factura.numero),
      total,
      idTipoFactura: Number(formData.factura.idTipoFactura),
    } as CreateComprobanteDto;
    
  } else {
    // REMITO: Nuevo flujo con productos manuales
    if (!formData.remito.productos || formData.remito.productos.length === 0) {
      throw new Error('Datos incompletos para crear el remito');
    }

    const productos = formData.remito.productos.map(item => ({
      idProducto: item.producto.id,
      cantidad: item.cantidad
    }));

    return {
      ...basePayload,
      productos,
      direccion_entrega: formData.remito.direccion_entrega,
      // NO agregar: idOrdenDeCompra, idDeposito, numero, total, idTipoFactura
    } as CreateComprobanteDto;
  }
};

// Funciones helper para UI
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(amount);
};

export const formatDisplayDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-AR');
};

export const getTipoConfig = (tipo: 'remito' | 'factura') => {
  const configs = {
    remito: {
      title: 'Nuevo Remito',
      subtitle: 'Documento de entrega sin cálculo de precios',
      icon: '📦',
      color: 'emerald'
    },
    factura: {
      title: 'Nueva Factura', 
      subtitle: 'Documento de facturación con totales',
      icon: '📄',
      color: 'blue'
    }
  };
  
  return configs[tipo];
};

// Mock para submit (debes reemplazar con tu implementación real)
export const submitComprobante = async (payload: CreateComprobanteDto): Promise<void> => {
  console.log('📤 Enviando comprobante:', payload);
  
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simular envío exitoso
  console.log('✅ Comprobante creado exitosamente');
  
  // Aquí deberías hacer el fetch real a tu backend:
  // const response = await fetch('/api/comprobantes', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload)
  // });
  // 
  // if (!response.ok) {
  //   throw new Error('Error al crear comprobante');
  // }
};