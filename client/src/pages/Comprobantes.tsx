import React, { useState } from 'react';
import { Remitos, Facturas } from '../components/comprobantes/';
import { FileText, Receipt, Plus, X, Calendar, Hash, StickyNote } from 'lucide-react';
import type { Factura } from '../services/comprobantesService';

// Si tenés este valor en un service, no pasa nada: acá lo usamos local también
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

type DetalleItem = {
  productoId: number | '';
  cantidad: number | '';
  precio_unitario_compra: number | '';
  iva_porcentaje?: number | '';
};

const inicialDetalle: DetalleItem = {
  productoId: '',
  cantidad: '',
  precio_unitario_compra: '',
  iva_porcentaje: 21, // valor por defecto común; podés dejarlo vacío si querés
};

const NuevaFacturaModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // para refrescar listados de Facturas
}> = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [proveedorId, setProveedorId] = useState<number | ''>('');
  const [numero, setNumero] = useState<string>('');
  const [fecha, setFecha] = useState<string>(() => new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
  const [tipo, setTipo] = useState<string>('A'); // A/B/C opcional
  const [idRemito, setIdRemito] = useState<number | ''>('');
  const [observaciones, setObservaciones] = useState<string>('');

  const [detalles, setDetalles] = useState<DetalleItem[]>([{ ...inicialDetalle }]);

  const addDetalle = () => setDetalles((prev) => [...prev, { ...inicialDetalle }]);

  const removeDetalle = (idx: number) =>
    setDetalles((prev) => prev.filter((_, i) => i !== idx));

  const updateDetalle = (idx: number, patch: Partial<DetalleItem>) =>
    setDetalles((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, ...patch } : row))
    );

  const validar = () => {
    if (!proveedorId || !numero || !fecha || !idRemito) {
      setError('Completá proveedor, número, fecha e idRemito.');
      return false;
    }
    if (detalles.length === 0) {
      setError('Agregá al menos un ítem de detalle.');
      return false;
    }
    for (const [i, d] of detalles.entries()) {
      if (!d.productoId || !d.cantidad || !d.precio_unitario_compra) {
        setError(`Detalle #${i + 1}: faltan datos (producto, cantidad o precio).`);
        return false;
      }
      if (Number(d.cantidad) <= 0 || Number(d.precio_unitario_compra) < 0) {
        setError(`Detalle #${i + 1}: cantidad debe ser > 0 y precio >= 0.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validar()) return;

    setLoading(true);
    try {
      const payload = {
        proveedorId: Number(proveedorId),
        numero: numero.trim(),
        fecha,
        tipo: tipo?.trim() || undefined,
        idRemito: Number(idRemito),
        observaciones: observaciones?.trim() || undefined,
        detalles: detalles.map((d) => ({
          productoId: Number(d.productoId),
          cantidad: Number(d.cantidad),
          precio_unitario_compra: Number(d.precio_unitario_compra),
          iva_porcentaje:
            d.iva_porcentaje === '' || d.iva_porcentaje === undefined
              ? undefined
              : Number(d.iva_porcentaje),
        })),
      };

      const res = await fetch(`${API_BASE_URL}/facturas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Error HTTP ${res.status}`);
      }

      setSuccess(true);
      onSuccess(); // refrescá la lista de facturas afuera
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 900);
    } catch (e: any) {
      setError(e?.message || 'Error al crear la factura');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xl flex items-center justify-center p-4 z-[60]" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Registrar Factura</h3>
              <p className="text-sm text-gray-600">Carga los datos y los ítems de la factura</p>
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
              Factura creada correctamente
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
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
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
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="Ej: A-0001-00001234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Remito *</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  value={idRemito}
                  onChange={(e) => setIdRemito(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ej: 101"
                  min={1}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <div className="relative">
                  <StickyNote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
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
                <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-white border border-gray-200 rounded-lg p-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Producto ID *</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
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

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Precio Unit. *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      value={row.precio_unitario_compra}
                      onChange={(e) =>
                        updateDetalle(idx, {
                          precio_unitario_compra: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      min={0}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">IVA %</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      value={row.iva_porcentaje ?? ''}
                      onChange={(e) =>
                        updateDetalle(idx, {
                          iva_porcentaje: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      min={0}
                      placeholder="0 / 10.5 / 21"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => removeDetalle(idx)}
                      className="w-full px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
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
            {loading ? 'Guardando...' : 'Guardar factura'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Comprobantes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'remitos' | 'facturas'>('remitos');
  const [showNuevaFactura, setShowNuevaFactura] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(0); // para forzar recarga de Facturas

  const handleFacturaCreada = () => {
    // levanta una bandera para que Facturas se recargue (si tu componente Facturas ya refetchea on mount)
    setReloadFlag((x) => x + 1);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Comprobantes</h1>
            <p className="text-gray-600 mt-1">Gestiona tus remitos y facturas.</p>
          </div>

          {activeTab === 'facturas' && (
            <button
              onClick={() => setShowNuevaFactura(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Nueva Factura
            </button>
          )}
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('remitos')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                ${activeTab === 'remitos' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FileText className="mr-2 h-5 w-5" />
              Remitos
            </button>
            <button
              onClick={() => setActiveTab('facturas')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                ${activeTab === 'facturas' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Receipt className="mr-2 h-5 w-5" />
              Facturas
            </button>
          </nav>
        </div>

        <div className="mt-8">
          {activeTab === 'remitos' && <Remitos />}
          {activeTab === 'facturas' && (
            // Si tu componente Facturas no escucha reloadFlag, podemos envolverlo para forzar un remount con key
            <div key={reloadFlag}>
              <Facturas />
            </div>
          )}
        </div>
      </div>

      <NuevaFacturaModal
        open={showNuevaFactura}
        onClose={() => setShowNuevaFactura(false)}
        onSuccess={handleFacturaCreada}
      />
    </div>
  );
};

export default Comprobantes;
