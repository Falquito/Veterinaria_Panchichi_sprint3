import React, { useState } from 'react';
import { Plus, AlertCircle, Check, Trash2, FileText, DollarSign, Calendar, User } from 'lucide-react';

import ProveedorSelector from "./selector/ProveedorSelector";
import ComprobanteSelector from "./selector/ComprobanteSelector";

const CrearOrdenDePago = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [showProveedorSelector, setShowProveedorSelector] = useState(false);
  const [showComprobanteSelector, setShowComprobanteSelector] = useState(false);

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().slice(0, 16),
    formaDePago: 'Transferencia',
    idProveedor: null,
    proveedorNombre: '',
    proveedorCuit: '',
    montoTotal: '',
    comprobantes: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProveedorSelect = (proveedor) => {
    setFormData(prev => ({
      ...prev,
      idProveedor: proveedor.id_proveedor,
      proveedorNombre: proveedor.nombre,
      proveedorCuit: proveedor.cuit,
      comprobantes: [] 
    }));
    setShowProveedorSelector(false);
  };

  const handleComprobanteSelect = (comprobante) => {

    if (formData.comprobantes.find(c => c.id === comprobante.id)) {
      setError('Este comprobante ya fue agregado');
      setTimeout(() => setError(null), 3000);
      return;
    }
    setFormData(prev => ({
      ...prev,
      comprobantes: [...prev.comprobantes, comprobante]
    }));
    setShowComprobanteSelector(false);
  };

  const removeComprobante = (id) => {
    setFormData(prev => ({
      ...prev,
      comprobantes: prev.comprobantes.filter(c => c.id !== id)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);


    if (!formData.idProveedor) {
      setError('Debes seleccionar un proveedor');
      setLoading(false);
      return;
    }
    if (!formData.fecha || !formData.formaDePago) {
      setError('Por favor completa todos los campos obligatorios');
      setLoading(false);
      return;
    }
    if (formData.comprobantes.length === 0) {
      setError('Debes agregar al menos un comprobante');
      setLoading(false);
      return;
    }
    if (!formData.montoTotal || parseFloat(formData.montoTotal) <= 0) {
      setError('Debes ingresar un monto total válido');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        fecha: formData.fecha,
        formaDePago: formData.formaDePago,
        idProveedor: formData.idProveedor,
        montoTotal: parseFloat(formData.montoTotal),
        comprobantes: formData.comprobantes.map(c => ({ idComprobante: c.id }))
      };


      const response = await fetch('http://localhost:3000/orden-de-pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear la orden de pago');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-xl bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Nueva Orden de Pago</h2>
                <p className="text-sm text-gray-600">Registra un pago a proveedor</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors">✕</button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span>Orden de pago creada exitosamente</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Info general */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  Información General
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Proveedor */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proveedor <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowProveedorSelector(true)}
                      className={`w-full px-4 py-3 border-2 rounded-lg text-left transition-all ${
                        formData.idProveedor
                          ? "border-green-300 bg-green-50 hover:bg-green-100"
                          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                    >
                      {formData.proveedorNombre ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-green-700" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{formData.proveedorNombre}</div>
                            <div className="text-sm text-gray-600">CUIT: {formData.proveedorCuit}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">Seleccionar proveedor...</span>
                      )}
                    </button>
                  </div>

                  {/* Fecha */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Forma de Pago */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Forma de Pago <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="formaDePago"
                      value={formData.formaDePago}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Efectivo"> Efectivo</option>
                      <option value="Transferencia"> Transferencia</option>
                      
                    </select>
                  </div>

                  {/* Monto Total */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto Total <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="montoTotal"
                        value={formData.montoTotal}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Comprobantes */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    Comprobantes
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.idProveedor) {
                        setError('Primero debes seleccionar un proveedor');
                        setTimeout(() => setError(null), 3000);
                        return;
                      }
                      setShowComprobanteSelector(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Comprobante
                  </button>
                </div>

                {formData.comprobantes.length === 0 ? (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No hay comprobantes agregados</p>
                    <button
                      type="button"
                      onClick={() => {
                        if (!formData.idProveedor) {
                          setError('Primero debes seleccionar un proveedor');
                          setTimeout(() => setError(null), 3000);
                          return;
                        }
                        setShowComprobanteSelector(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar primer comprobante
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.comprobantes.map((comprobante, idx) => (
                      <div key={comprobante.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center font-bold text-purple-700">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="font-semibold text-gray-900">Comprobante #{comprobante.id}</div>
                                <div className="text-sm text-gray-600">{comprobante.tipoDeComprobante?.nombre || 'Sin tipo'}</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeComprobante(comprobante.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Fecha:</span>
                                <span className="ml-2 text-gray-900">
                                  {comprobante.fecha ? new Date(comprobante.fecha).toLocaleDateString('es-AR') : 'Sin fecha'}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Depósito:</span>
                                <span className="ml-2 text-gray-900">{comprobante.deposito?.nombre || 'Sin depósito'}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-500">Productos:</span>
                                <span className="ml-2 text-gray-900">{comprobante.detalles?.length || 0} items</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {formData.comprobantes.length > 0 && (
                  <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-blue-900 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Total de comprobantes:
                      </span>
                      <span className="text-lg font-bold text-blue-900">{formData.comprobantes.length}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-lg transition-all border border-gray-300" disabled={loading}>
                Cancelar
              </button>
              <button onClick={handleSubmit} disabled={loading || success} className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creando...
                  </>
                ) : success ? (
                  <>
                    <Check className="w-5 h-5" />
                    Creado
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Crear Orden de Pago
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ⬇️ Modales REALES */}
      {showProveedorSelector && (
        <ProveedorSelector
          selectedProveedorId={formData.idProveedor}
          onSelect={handleProveedorSelect}
          onClose={() => setShowProveedorSelector(false)}
        />
      )}

      {showComprobanteSelector && formData.idProveedor && (
        <ComprobanteSelector
          proveedorId={formData.idProveedor}
          selectedComprobanteId={null}
          onSelect={handleComprobanteSelect}
          onClose={() => setShowComprobanteSelector(false)}
        />
      )}
    </>
  );
};

export default CrearOrdenDePago;
