import React, { useState } from 'react';
import { Receipt, X, Plus, User, FileText, ChevronDown, Package, Calendar, DollarSign, Warehouse, Calculator, Truck, FileBarChart, Trash2 } from 'lucide-react';
import type { ModalProps, ComprobanteFormData, TipoComprobante } from '../types/comprobantes';
import type { Proveedor } from '../types/proveedor';
import type { OrdenDeCompra } from '../types/orden-de-compra';
import type { Depot } from '../types/depot';
import type { Product } from '../types/product';
import { 
  COMPROBANTE_FORM_INICIAL, 
  TIPOS_COMPROBANTE_OPTIONS,
  TIPOS_FACTURA_OPTIONS,
  CSS_CLASSES 
} from '../constants/factura-constants'
import { 
  validateComprobanteForm, 
  createComprobantePayload, 
  submitComprobante, 
  formatDateForInput,
  calcularSubtotalOrden,
  calcularIVA,
  calcularTotalOrden,
  formatCurrency,
  formatDisplayDate,
  getTipoConfig
} from '../utils/factura';
import { ProveedorSelector } from '../components/ProveedorSelector';
import { OrdenDeCompraSelector } from '../components/OrdendeCompraSelector';
import { DepositoSelector } from './DepositoSelector';
import { ProductSelector } from '../components/Productselector';
export const ComprobanteModal: React.FC<ModalProps> = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para los modales de selección
  const [showProveedorSelector, setShowProveedorSelector] = useState(false);
  const [showOrdenSelector, setShowOrdenSelector] = useState(false);
  const [showDepositoSelector, setShowDepositoSelector] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);

  // Estado del formulario unificado
  const [formData, setFormData] = useState<ComprobanteFormData>({
    ...COMPROBANTE_FORM_INICIAL,
    fecha: formatDateForInput(),
  });

  // Handlers para actualizar el formulario
  const updateFormData = (updates: Partial<ComprobanteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormData({
      ...COMPROBANTE_FORM_INICIAL,
      fecha: formatDateForInput(),
    });
    setError(null);
  };

  // Handlers para los selectores
  const handleProveedorSelect = (proveedor: Proveedor) => {
    updateFormData({ 
      proveedor,
      ordenDeCompra: null // Reset orden cuando cambia proveedor (solo para facturas)
    });
  };

  const handleOrdenSelect = (orden: OrdenDeCompra) => {
    updateFormData({ ordenDeCompra: orden });
  };

  const handleDepositoSelect = (deposito: Depot) => {
    updateFormData({ deposito });
  };

  const handleTipoSelect = (tipo: TipoComprobante) => {
    updateFormData({ tipoComprobante: tipo });
  };

  const handleProductSelect = (product: Product) => {
    // Verificar si el producto ya está en la lista
    const existingProductIndex = formData.remito.productos.findIndex(
      item => item.producto.id === product.id
    );
    
    if (existingProductIndex >= 0) {
      // Si ya existe, incrementar cantidad
      const updatedProducts = [...formData.remito.productos];
      updatedProducts[existingProductIndex].cantidad += 1;
      
      updateFormData({
        remito: {
          ...formData.remito,
          productos: updatedProducts
        }
      });
    } else {
      // Si no existe, agregar con cantidad 1
      const newProduct: ProductoRemito = {
        producto: product,
        cantidad: 1
      };
      
      updateFormData({
        remito: {
          ...formData.remito,
          productos: [...formData.remito.productos, newProduct]
        }
      });
    }
  };

  const handleRemoveProduct = (productId: number) => {
    const updatedProducts = formData.remito.productos.filter(
      item => item.producto.id !== productId
    );
    
    updateFormData({
      remito: {
        ...formData.remito,
        productos: updatedProducts
      }
    });
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveProduct(productId);
      return;
    }

    const updatedProducts = formData.remito.productos.map(item =>
      item.producto.id === productId 
        ? { ...item, cantidad: newQuantity }
        : item
    );
    
    updateFormData({
      remito: {
        ...formData.remito,
        productos: updatedProducts
      }
    });
  };

  // Calcular valores actuales (solo para facturas)
  const subtotalActual = calcularSubtotalOrden(formData);
  const ivaActual = calcularIVA(formData);
  const totalActual = calcularTotalOrden(formData);

  // Obtener configuración visual según el tipo
  const tipoConfig = formData.tipoComprobante ? getTipoConfig(formData.tipoComprobante) : null;

  const handleSubmit = async () => {
    setError(null);
    
    const validationError = validateComprobanteForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = createComprobantePayload(formData);
      await submitComprobante(payload);
      
      onSuccess();
      resetForm();
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Error al crear el comprobante');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 fixed inset-0 backdrop-blur-sm bg-white/10 transition-all duration-300  bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
        <div
          className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header dinámico */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${tipoConfig?.color === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'} rounded-lg flex items-center justify-center`}>
                {tipoConfig?.icon === '📦' ? <Truck className="w-6 h-6 text-white" /> : <Receipt className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {tipoConfig?.title || 'Nuevo Comprobante'}
                </h3>
                <p className="text-sm text-gray-500">
                  {tipoConfig?.subtitle || 'Selecciona el tipo de comprobante'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Selección de Tipo de Comprobante */}
            {!formData.tipoComprobante && (
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <h4 className="text-lg font-semibold text-gray-900">Tipo de Comprobante</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TIPOS_COMPROBANTE_OPTIONS.map((tipo) => (
                    <button
                      key={tipo.value}
                      onClick={() => handleTipoSelect(tipo.value)}
                      className={`${CSS_CLASSES.TIPO_CARD} ${CSS_CLASSES.TIPO_CARD_UNSELECTED}`}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">{tipo.icon}</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{tipo.label}</h3>
                        <p className="text-sm text-gray-600">
                          {tipo.value === 'remito' 
                            ? 'Documento para el transporte de mercadería'
                            : 'Documento para facturación con cálculo de totales'
                          }
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resto del formulario - solo si ya se seleccionó tipo */}
            {formData.tipoComprobante && (
              <>
                {/* Selección de Proveedor (común para ambos) */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <h4 className="text-lg font-semibold text-gray-900">Información del Proveedor</h4>
                  </div>
                  
                  <div className="mb-6">
                    {/* Selector de Proveedor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Proveedor <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowProveedorSelector(true)}
                        className={CSS_CLASSES.SELECTOR_BUTTON}
                      >
                        {formData.proveedor ? (
                          <div className={CSS_CLASSES.SELECTOR_CONTENT}>
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{formData.proveedor.nombre}</p>
                              {formData.proveedor.cuit && (
                                <p className="text-sm text-gray-500">CUIT: {formData.proveedor.cuit}</p>
                              )}
                            </div>
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          </div>
                        ) : (
                          <div className={CSS_CLASSES.SELECTOR_PLACEHOLDER}>
                            <span>Seleccionar proveedor...</span>
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sección específica de FACTURA */}
                {formData.tipoComprobante === 'factura' && (
                  <>
                    {/* Selección de Orden de Compra (SOLO para facturas) */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        <h4 className="text-lg font-semibold text-gray-900">Orden de Compra</h4>
                      </div>
                      
                      <div className="mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Orden de Compra <span className="text-red-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowOrdenSelector(true)}
                            disabled={!formData.proveedor}
                            className={`${CSS_CLASSES.SELECTOR_BUTTON} ${!formData.proveedor ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {formData.ordenDeCompra ? (
                              <div className={CSS_CLASSES.SELECTOR_CONTENT}>
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-4 h-4 text-orange-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900">OC #{formData.ordenDeCompra.id_oc}</p>
                                  <p className="text-sm text-gray-500">
                                    {formatDisplayDate(formData.ordenDeCompra.fecha)} • {formData.ordenDeCompra.productos.length} productos
                                  </p>
                                </div>
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              </div>
                            ) : (
                              <div className={CSS_CLASSES.SELECTOR_PLACEHOLDER}>
                                <span>{formData.proveedor ? 'Seleccionar orden...' : 'Primero selecciona un proveedor'}</span>
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Productos de la Orden (solo para facturas) */}
                    {formData.ordenDeCompra && (
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <h4 className="text-lg font-semibold text-gray-900">Productos de la Orden</h4>
                          <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            Solo lectura
                          </span>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                          <div className="space-y-3">
                            {formData.ordenDeCompra.productos.map((item, index) => (
                              <div key={item.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{item.producto.nombre}</p>
                                    <p className="text-sm text-gray-500">
                                      {item.producto.categoria?.nombre && `${item.producto.categoria.nombre} • `}
                                      Precio: ${item.producto.precio.toLocaleString('es-AR')}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-900">Cantidad: {item.cantidad}</p>
                                  <p className="text-sm text-gray-500">
                                    Subtotal: ${(item.cantidad * item.producto.precio).toLocaleString('es-AR')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Desglose de totales para facturas */}
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-gray-700">
                                <span className="font-medium">Subtotal:</span>
                                <span className="font-medium">
                                  {formatCurrency(subtotalActual)}
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center text-gray-700">
                                <span className="font-medium">
                                  IVA ({Number(formData.factura.ivaPorcentaje || 0)}%):
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(ivaActual)}
                                </span>
                              </div>
                              
                              <div className="border-t border-gray-300 pt-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-lg font-semibold text-gray-700">Total Final:</span>
                                  <span className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(totalActual)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Sección específica de REMITO */}
                {formData.tipoComprobante === 'remito' && (
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                      <h4 className="text-lg font-semibold text-gray-900">Productos del Remito</h4>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Productos <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowProductSelector(true)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Agregar Producto
                        </button>
                      </div>
                      
                      {/* Lista de productos seleccionados */}
                      {formData.remito.productos.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">No hay productos agregados</p>
                          <p className="text-gray-400 text-xs mt-1">
                            Hacé clic en "Agregar Producto" para comenzar
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {formData.remito.productos.map((item) => (
                            <div key={item.producto.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                              {item.producto.imagen ? (
                                <img
                                  src={item.producto.imagen}
                                  alt={item.producto.nombre}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                  <Package className="w-6 h-6 text-emerald-600" />
                                </div>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{item.producto.nombre}</p>
                                <p className="text-sm text-gray-500">ID: {item.producto.id}</p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Cantidad:</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.cantidad}
                                  onChange={(e) => handleUpdateQuantity(item.producto.id, Number(e.target.value))}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center"
                                />
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => handleRemoveProduct(item.producto.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar producto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Información simple para remitos */}
                      {formData.remito.productos.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="bg-emerald-50 rounded-lg p-4">
                            <div className="flex items-center text-emerald-700">
                              <Truck className="w-5 h-5 mr-2" />
                              <span className="font-medium">
                                Remito de {formData.remito.productos.length} productos
                              </span>
                            </div>
                            <p className="text-sm text-emerald-600 mt-1">
                              Los remitos no incluyen cálculos de precios
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Información Específica del Comprobante */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        Información del {formData.tipoComprobante === 'factura' ? 'Factura' : 'Remito'}
                      </h4>
                    </div>
                    
                    {/* Botón para cambiar tipo */}
                    <button
                      onClick={() => updateFormData({ tipoComprobante: null })}
                      className="text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      Cambiar tipo
                    </button>
                  </div>
                  
                  {formData.tipoComprobante === 'factura' ? (
                    // Campos específicos de FACTURA
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            step="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={formData.factura.numero}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Solo permitir números enteros positivos
                              if (value === '' || (/^\d+$/.test(value) && Number(value) > 0)) {
                                updateFormData({
                                  factura: {
                                    ...formData.factura,
                                    numero: value === '' ? '' : Number(value)
                                  }
                                });
                              }
                            }}
                            placeholder="0001"
                            min={1}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={formData.fecha}
                            onChange={(e) => updateFormData({ fecha: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Factura <span className="text-red-500">*</span>
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={formData.factura.idTipoFactura}
                            onChange={(e) => updateFormData({
                              factura: {
                                ...formData.factura,
                                idTipoFactura: e.target.value === '' ? '' : Number(e.target.value)
                              }
                            })}
                          >
                            <option value="">Seleccionar tipo...</option>
                            {TIPOS_FACTURA_OPTIONS.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Selector de Depósito para facturas */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Depósito <span className="text-red-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowDepositoSelector(true)}
                            className={CSS_CLASSES.SELECTOR_BUTTON}
                          >
                            {formData.deposito ? (
                              <div className={CSS_CLASSES.SELECTOR_CONTENT}>
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Warehouse className="w-4 h-4 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 truncate">{formData.deposito.nombre}</p>
                                  <p className="text-sm text-gray-500">ID: {formData.deposito.id_deposito}</p>
                                </div>
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              </div>
                            ) : (
                              <div className={CSS_CLASSES.SELECTOR_PLACEHOLDER}>
                                <span>Seleccionar depósito...</span>
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Campo de IVA */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          IVA (%)
                        </label>
                        <div className="relative">
                          <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="number"
                            step="0.01"
                            className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            value={formData.factura.ivaPorcentaje}
                            onChange={(e) => updateFormData({
                              factura: {
                                ...formData.factura,
                                ivaPorcentaje: e.target.value === '' ? '' : Number(e.target.value)
                              }
                            })}
                            placeholder="21"
                            min={0}
                            max={100}
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Se aplicará al subtotal de la orden de compra
                        </p>
                      </div>
                    </>
                  ) : (
                    // Campos específicos de REMITO (SIN orden de compra, SIN depósito)
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fecha <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                          value={formData.fecha}
                          onChange={(e) => updateFormData({ fecha: e.target.value })}
                        />
                      </div>

                      {/* Dirección de entrega para remito */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección de Entrega <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Truck className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                          <textarea
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                            rows={3}
                            value={formData.remito.direccion_entrega}
                            onChange={(e) => updateFormData({
                              remito: {
                                ...formData.remito,
                                direccion_entrega: e.target.value
                              }
                            })}
                            placeholder="Ingresá la dirección donde se entregará la mercadería..."
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      rows={3}
                      value={formData.observaciones}
                      onChange={(e) => updateFormData({ observaciones: e.target.value })}
                      placeholder="Observaciones adicionales (opcional)"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer dinámico */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              
              {formData.tipoComprobante && (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`flex-1 px-6 py-3 ${
                    formData.tipoComprobante === 'factura' 
                      ? 'bg-blue-500 hover:bg-blue-600' 
                      : 'bg-emerald-500 hover:bg-emerald-600'
                  } text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Creando...
                    </div>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 inline mr-2" />
                      Crear {formData.tipoComprobante === 'factura' ? 'Factura' : 'Remito'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modales de Selección */}
      <ProveedorSelector
        open={showProveedorSelector}
        onClose={() => setShowProveedorSelector(false)}
        onSelect={handleProveedorSelect}
        selectedProveedorId={formData.proveedor?.id_proveedor}
      />

      <OrdenDeCompraSelector
        open={showOrdenSelector}
        onClose={() => setShowOrdenSelector(false)}
        onSelect={handleOrdenSelect}
        proveedorId={formData.proveedor?.id_proveedor}
        selectedOrdenId={formData.ordenDeCompra?.id_oc}
      />

      <DepositoSelector
        open={showDepositoSelector}
        onClose={() => setShowDepositoSelector(false)}
        onSelect={handleDepositoSelect}
        selectedDepositoId={formData.deposito?.id_deposito}
      />

      <ProductSelector
        open={showProductSelector}
        onClose={() => setShowProductSelector(false)}
        onSelect={handleProductSelect}
      />
    </>
  );
};

// Mantener compatibilidad con imports existentes
export const FacturaModal = ComprobanteModal;