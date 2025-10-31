import React, { useState } from 'react';
import { FileText, X, Plus, Hash, Calendar, Package, Warehouse, StickyNote } from 'lucide-react';
import type { ModalProps, DetalleRemitoForm } from '../types/comprobantes';
import { DETALLE_REMITO_INICIAL, CSS_CLASSES } from '../hooks/constants';
import { validateRemitoForm, createRemitoPayload, submitComprobante, formatDateForInput } from '../utils/utils';

export const RemitoModal: React.FC<ModalProps> = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Campos del formulario
  const [proveedorId, setProveedorId] = useState<number | ''>('');
  const [numero, setNumero] = useState<number | ''>('');
  const [fecha, setFecha] = useState<string>(formatDateForInput());
  const [idOrdenDeCompra, setIdOrdenDeCompra] = useState<number | ''>('');
  const [idDeposito, setIdDeposito] = useState<number | ''>('');
  const [observaciones, setObservaciones] = useState<string>('');
  
  const [detalles, setDetalles] = useState<DetalleRemitoForm[]>([{ ...DETALLE_REMITO_INICIAL }]);

  // Funciones para manejar detalles
  const addDetalle = () => setDetalles(prev => [...prev, { ...DETALLE_REMITO_INICIAL }]);
  
  const removeDetalle = (idx: number) => 
    setDetalles(prev => prev.filter((_, i) => i !== idx));
  
  const updateDetalle = (idx: number, patch: Partial<DetalleRemitoForm>) =>
    setDetalles(prev => prev.map((row, i) => (i === idx ? { ...row, ...patch } : row)));

  const resetForm = () => {
    setProveedorId('');
    setNumero('');
    setFecha(formatDateForInput());
    setIdOrdenDeCompra('');
    setIdDeposito('');
    setObservaciones('');
    setDetalles([{ ...DETALLE_REMITO_INICIAL }]);
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async () => {
    setError(null);
    
    const validationError = validateRemitoForm(
      proveedorId, numero, fecha, idOrdenDeCompra, idDeposito, detalles
    );
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = createRemitoPayload(
        Number(proveedorId),
        Number(numero),
        fecha,
        Number(idOrdenDeCompra),
        Number(idDeposito),
        detalles,
        observaciones
      );

      await submitComprobante(payload);
      
      setSuccess(true);
      onSuccess();
      
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1000);
    } catch (e: any) {
      setError(e?.message || 'Error al crear el remito');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className={CSS_CLASSES.MODAL_OVERLAY} onClick={onClose}>
      <div className={CSS_CLASSES.MODAL_CONTENT} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Registrar Remito</h3>
              <p className="text-sm text-gray-600">Carga los datos y los ítems del remito</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              Remito creado correctamente
            </div>
          )}

          {/* Datos generales */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">Datos generales</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor ID *</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    className={CSS_CLASSES.INPUT_WITH_ICON}
                    value={proveedorId}
                    onChange={(e) => setProveedorId(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ej: 12"
                    min={1}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                <input
                  type="number"
                  className={CSS_CLASSES.INPUT_BASE}
                  value={numero}
                  onChange={(e) => setNumero(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ej: 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    className={CSS_CLASSES.INPUT_WITH_ICON}
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Orden Compra *</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    className={CSS_CLASSES.INPUT_WITH_ICON}
                    value={idOrdenDeCompra}
                    onChange={(e) => setIdOrdenDeCompra(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ej: 203"
                    min={1}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Depósito *</label>
                <div className="relative">
                  <Warehouse className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    className={CSS_CLASSES.INPUT_WITH_ICON}
                    value={idDeposito}
                    onChange={(e) => setIdDeposito(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ej: 1"
                    min={1}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <div className="relative">
                  <StickyNote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    className={CSS_CLASSES.INPUT_WITH_ICON}
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Opcional"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Detalles */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-900">Detalles</h4>
              <button
                onClick={addDetalle}
                className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
                Agregar ítem
              </button>
            </div>

            <div className="space-y-3">
              {detalles.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white border border-gray-200 rounded-lg p-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Producto ID *</label>
                    <input
                      type="number"
                      className={CSS_CLASSES.INPUT_BASE}
                      value={row.productoId}
                      onChange={(e) =>
                        updateDetalle(idx, {
                          productoId: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      min={1}
                      placeholder="ID"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Cantidad *</label>
                    <input
                      type="number"
                      className={CSS_CLASSES.INPUT_BASE}
                      value={row.cantidad}
                      onChange={(e) =>
                        updateDetalle(idx, {
                          cantidad: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      min={1}
                      placeholder="0"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => removeDetalle(idx)}
                      className={CSS_CLASSES.BUTTON_SECONDARY + ' w-full'}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-lg border border-gray-300"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Guardar remito'}
          </button>
        </div>
      </div>
    </div>
  );
};