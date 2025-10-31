// Constantes actualizadas para remitos con ProductSelector

export const TIPO_COMPROBANTE = {
  REMITO: 1,
  FACTURA: 2
} as const;

// Valores iniciales ACTUALIZADOS
export const COMPROBANTE_FORM_INICIAL = {
  tipoComprobante: null as 'remito' | 'factura' | null,
  proveedor: null,
  fecha: '', // Se setea con formatDateForInput()
  observaciones: '',
  
  // Campos específicos de factura
  factura: {
    numero: '' as number | '',
    idTipoFactura: '' as number | '',
    ivaPorcentaje: 21 as number | '',
  },
  
  // Campos específicos de remito (ACTUALIZADO)
  remito: {
    productos: [], // ← NUEVO: Array para productos manuales
    direccion_entrega: '',
  },
  
  // Campos para facturas (mantener compatibilidad)
  ordenDeCompra: null,
  deposito: null,
};

// Configuración de validaciones
export const VALIDATION_RULES = {
  MIN_ID: 1,
  MAX_PERCENTAGE: 100
} as const;

// Mensajes de error ACTUALIZADOS
export const ERROR_MESSAGES = {
  TIPO_REQUERIDO: 'Seleccioná el tipo de comprobante.',
  PROVEEDOR_REQUERIDO: 'Seleccioná un proveedor.',
  FECHA_REQUERIDA: 'Ingresá la fecha.',
  
  // Errores específicos de factura
  ORDEN_REQUERIDA: 'Seleccioná una orden de compra.',
  DEPOSITO_REQUERIDO: 'Seleccioná un depósito.',
  NUMERO_REQUERIDO: 'Ingresá un número de factura válido (entero positivo).',
  NUMERO_INVALIDO: 'El número debe ser un entero mayor a 0.',
  TIPO_FACTURA_REQUERIDO: 'Seleccioná el tipo de factura.',
  IVA_INVALIDO: 'El IVA debe ser mayor o igual a 0.',
  ORDEN_SIN_PRODUCTOS: 'La orden de compra seleccionada no tiene productos.',
  
  // Errores específicos de remito (NUEVOS)
  DIRECCION_ENTREGA_REQUERIDA: 'Ingresá la dirección de entrega.',
  PRODUCTOS_REMITO_REQUERIDOS: 'Agregá al menos un producto al remito.',
  CANTIDAD_INVALIDA: 'La cantidad debe ser mayor a 0.',
} as const;

// Opciones para tipos de comprobante
export const TIPOS_COMPROBANTE_OPTIONS = [
  { value: 'remito', label: 'Remito', icon: '📦', color: 'emerald' },
  { value: 'factura', label: 'Factura', icon: '📄', color: 'blue' },
] as const;

// Opciones para tipos de factura
export const TIPOS_FACTURA_OPTIONS = [
  { value: 1, label: 'Factura A' },
  { value: 2, label: 'Factura B' },
  { value: 3, label: 'Factura C' },
] as const;

// CSS Classes
export const CSS_CLASSES = {
  TIPO_CARD: "relative p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg",
  TIPO_CARD_SELECTED: "border-blue-500 bg-blue-50",
  TIPO_CARD_UNSELECTED: "border-gray-200 hover:border-blue-300",
  SELECTOR_BUTTON: "w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  SELECTOR_CONTENT: "flex items-center space-x-3 flex-1 min-w-0",
  SELECTOR_PLACEHOLDER: "flex items-center justify-between w-full text-gray-500",
} as const;