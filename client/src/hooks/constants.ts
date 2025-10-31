// Constantes para el módulo de comprobantes
export const API_BASE_URL = 'http://localhost:3000';

// IDs de tipos de comprobante
export const TIPO_COMPROBANTE = {
  REMITO: 1,
  FACTURA: 2,
} as const;

// Valores iniciales para formularios
export const DETALLE_FACTURA_INICIAL = {
  productoId: '' as number | '',
  producto: undefined, // Agregamos el producto completo para mostrar información
  cantidad: '' as number | '',
  precio_unitario_compra: '' as number | '',
  iva_porcentaje: 21 as number | '',
};

export const DETALLE_REMITO_INICIAL = {
  productoId: '',
  cantidad: '',
} as const;

// Configuración de validaciones
export const VALIDATION_RULES = {
  MIN_CANTIDAD: 1,
  MIN_PRECIO: 0,
  MIN_ID: 1,
  IVA_DEFAULT: 21,
} as const;

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  CAMPOS_REQUERIDOS: 'Completá todos los campos requeridos.',
  DETALLE_VACIO: 'Agregá al menos un ítem de detalle.',
  CANTIDAD_INVALIDA: 'La cantidad debe ser mayor a 0.',
  PRECIO_INVALIDO: 'El precio debe ser mayor o igual a 0.',
  DATOS_FALTANTES: 'Faltan datos en el detalle',
} as const;

// Configuración de clases CSS reutilizables
export const CSS_CLASSES = {
  BUTTON_PRIMARY: 'px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg',
  BUTTON_SECONDARY: 'px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50',
  INPUT_BASE: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500',
  INPUT_WITH_ICON: 'w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500',
  MODAL_OVERLAY: 'fixed inset-0 backdrop-blur-xl flex items-center justify-center p-4 z-[60]',
  MODAL_CONTENT: 'bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col',
} as const;