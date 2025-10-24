import React, { useEffect, useState } from 'react';
// MODIFICADO: Importamos más íconos
import { FileText, Receipt, Plus, X, Calendar, Hash, StickyNote, Package, Warehouse, Eye, Trash2 } from 'lucide-react';
import type { Factura } from '../services/comprobantesService';

// MODIFICADO: Se reemplaza import.meta.env para evitar error de compilación es2015
const API_BASE_URL = 'http://localhost:3000';

// --- Componentes Placeholder (para simular la importación y evitar error) ---
const Remitos: React.FC<{remitos: any[]}> = ({remitos}) => ( // MODIFICADO: Acepta props
  <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">O.C. ID</th>
            
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* MODIFICADO: Verifica que remitos exista */}
          {remitos && remitos.map((remito) => (
            <tr key={remito.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{remito.numero}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{remito.fecha}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{remito.proveedor.id_proveedor}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{remito.ordenDeCompra?remito.ordenDeCompra.id_oc:""}</td>

              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                  <Eye className="w-4 h-4" /> Ver
                </button>
                <button className="text-red-600 hover:text-red-800 inline-flex items-center gap-1">
                  <Trash2 className="w-4 h-4" /> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
);

const Facturas: React.FC<{facturas: any[]}> = ({facturas}) => ( // MODIFICADO: Acepta props
  <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Factura ID</th>

            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* MODIFICADO: Verifica que facturas exista */}
          {facturas && facturas.map((factura) => (
            <tr key={factura.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{factura.numero}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{factura.fecha}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{factura.proveedor.id_proveedor}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {/* MODIFICADO: Muestra el ID de tipoFactura */}
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    factura.tipoFactura?.id === 1 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                  {factura.tipoFactura?.id} ({factura.tipoFactura?.tipo})
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{factura.total}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                  <Eye className="w-4 h-4" /> Ver
                </button>
                <button className="text-red-600 hover:text-red-800 inline-flex items-center gap-1">
                  <Trash2 className="w-4 h-4" /> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
);
// --- Fin de Componentes Placeholder ---


// --- NUEVO: Definición de tipo para Detalle de Remito ---
type DetalleRemitoItem = {
  productoId: number | '';
  cantidad: number | '';
};

const inicialDetalleRemito: DetalleRemitoItem = {
  productoId: '',
  cantidad: '',
};

// --- NUEVO: Modal para crear Remitos, basado en el de Facturas ---
const NuevoRemitoModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // para refrescar listados de Remitos
}> = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // --- Campos específicos para Remito ---
  const [proveedorId, setProveedorId] = useState<number | ''>('');
  // MODIFICADO: El DTO espera un número
  const [numero, setNumero] = useState<number | ''>(''); 
  const [fecha, setFecha] = useState<string>(() => new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
  const [idOrdenDeCompra, setIdOrdenDeCompra] = useState<number | ''>('');
  const [idDeposito, setIdDeposito] = useState<number | ''>('');
  const [observaciones, setObservaciones] = useState<string>('');
  
  const [detalles, setDetalles] = useState<DetalleRemitoItem[]>([{ ...inicialDetalleRemito }]);

  const addDetalle = () => setDetalles((prev) => [...prev, { ...inicialDetalleRemito }]);

  const removeDetalle = (idx: number) =>
    setDetalles((prev) => prev.filter((_, i) => i !== idx));

  const updateDetalle = (idx: number, patch: Partial<DetalleRemitoItem>) =>
    setDetalles((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, ...patch } : row))
    );

  const validar = () => {
    // Validamos campos de Remito
    if (!proveedorId || !numero || !fecha || !idOrdenDeCompra || !idDeposito) {
      setError('Completá proveedor, número, fecha, ID O.C. e ID Depósito.');
      return false;
    }
    if (detalles.length === 0) {
      setError('Agregá al menos un ítem de detalle.');
      return false;
    }
    for (const [i, d] of detalles.entries()) {
      if (!d.productoId || !d.cantidad) {
        setError(`Detalle #${i + 1}: faltan datos (producto o cantidad).`);
        return false;
      }
      if (Number(d.cantidad) <= 0) {
        setError(`Detalle #${i + 1}: cantidad debe ser > 0.`);
        return false;
      }
    }
    return true;
  };

  // MODIFICADO: Payload adaptado a CreateComprobanteDto
  const handleSubmit = async () => {
    setError(null);
    if (!validar()) return;

    setLoading(true);
    try {
      const payload = {
        idTipoDeComprobante: 1, // 1 para Remito (suposición)
        fecha: fecha,
        idProveedor: Number(proveedorId),
        idOrdenDeCompra: Number(idOrdenDeCompra),
        idDeposito: Number(idDeposito),
        productos: detalles.map((d) => ({
          idProducto: Number(d.productoId), // Adaptado a DTO
          cantidad: Number(d.cantidad),
        })),
        observaciones: observaciones?.trim() || undefined,
        numero: Number(numero), // Adaptado a DTO
        total: 0, // Remitos no tienen total
        
      };

      // Asumimos un endpoint /remitos
      const res = await fetch(`${API_BASE_URL}/comprobante`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Error HTTP ${res.status}`);
      }

      setSuccess(true);
      onSuccess(); // refrescá la lista de remitos afuera
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 900);
    } catch (e: any) {
      setError(e?.message || 'Error al crear el remito');
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
        {/* Header (diseño respetado) */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              {/* Ícono de Remito */}
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

          {/* Datos generales (campos de Remito) */}
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
                {/* MODIFICADO: type="number" para coincidir con DTO */}
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    value={idDeposito}
                    onChange={(e) => setIdDeposito(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ej: 1"
                    min={1}
                  />
                </div>
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

          {/* Detalles (sin precio ni IVA) */}
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
                // Ajustamos grid para 3 columnas
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white border border-gray-200 rounded-lg p-3">
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

        {/* Footer (diseño respetado) */}
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


// --- Modal de Facturas (MODIFICADO) ---
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
  iva_porcentaje: 21, 
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
  // MODIFICADO: El DTO espera un número
  const [numero, setNumero] = useState<number | ''>(''); 
  const [fecha, setFecha] = useState<string>(() => new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
  // MODIFICADO: Adaptado a DTO
  const [idTipoFactura, setIdTipoFactura] = useState<number | ''>(''); 
  const [idOrdenDeCompra, setIdOrdenDeCompra] = useState<number | ''>(''); // MODIFICADO: Adaptado a DTO (era idRemito)
  const [idDeposito, setIdDeposito] = useState<number | ''>(''); // NUEVO: Requerido por DTO
  const [observaciones, setObservaciones] = useState<string>('');

  const [detalles, setDetalles] = useState<DetalleItem[]>([{ ...inicialDetalle }]);

  const addDetalle = () => setDetalles((prev) => [...prev, { ...inicialDetalle }]);

  const removeDetalle = (idx: number) =>
    setDetalles((prev) => prev.filter((_, i) => i !== idx));

  const updateDetalle = (idx: number, patch: Partial<DetalleItem>) =>
    setDetalles((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, ...patch } : row))
    );

  // MODIFICADO: Se añaden validaciones para los campos nuevos/cambiados
  const validar = () => {
    if (!proveedorId || !numero || !fecha || !idOrdenDeCompra || !idDeposito || !idTipoFactura) {
      setError('Completá proveedor, número, fecha, ID O.C., ID Depósito e ID Tipo Factura.');
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

  // MODIFICADO: Payload adaptado a CreateComprobanteDto
  const handleSubmit = async () => {
    setError(null);
    if (!validar()) return;

    setLoading(true);
    try {
      // El DTO de producto no incluye precio, pero el DTO de comprobante sí tiene total.
      // Calculamos el total desde el detalle del modal.
      const totalCalculado = detalles.reduce((acc, d) => {
        const cantidad = Number(d.cantidad || 0);
        const precio = Number(d.precio_unitario_compra || 0);
        const iva = Number(d.iva_porcentaje || 0); // Asumimos que el precio ya tiene iva, o 0 si no se provee
        
        let itemTotal = cantidad * precio;
        if (iva > 0) {
           itemTotal = itemTotal * (1 + iva / 100);
        }
        return acc + itemTotal;
      }, 0);


      const payload = {
        idTipoDeComprobante: 2, // 2 para Factura (de tu código)
        fecha: fecha,
        idProveedor: Number(proveedorId),
        idOrdenDeCompra: Number(idOrdenDeCompra),
        idDeposito: Number(idDeposito),
        productos: detalles.map((d) => ({
          idProducto: Number(d.productoId), // Adaptado a DTO
          cantidad: Number(d.cantidad),
          // El DTO 'comprobanteProductDto' no incluye precio/iva
        })),
        observaciones: observaciones?.trim() || undefined,
        numero: Number(numero), // Adaptado a DTO
        total: totalCalculado, // Calculado desde el modal
        direccion_entrega: undefined, // No se recolecta
        idTipoFactura: Number(idTipoFactura), // Adaptado a DTO
      };

      const res = await fetch(`${API_BASE_URL}/comprobante`, {
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
            {/* MODIFICADO: grid-cols-4 para el nuevo campo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                {/* MODIFICADO: type="number" para DTO */}
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ej: 1234"
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
              
              {/* MODIFICADO: "Tipo" ahora es "ID Tipo Factura" (number) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Tipo Factura *</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  value={idTipoFactura}
                  onChange={(e) => setIdTipoFactura(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ej: 1 (A), 2 (B)..."
                />
              </div>
              
              {/* MODIFICADO: "ID Remito" ahora es "ID Orden Compra" */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Orden Compra *</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    value={idOrdenDeCompra}
                    onChange={(e) => setIdOrdenDeCompra(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ej: 203"
                    min={1}
                  />
                </div>
              </div>

              {/* NUEVO: Campo "ID Depósito" requerido por DTO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Depósito *</label>
                <div className="relative">
                  <Warehouse className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    value={idDeposito}
                    onChange={(e) => setIdDeposito(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ej: 1"
                    min={1}
                  />
                </div>
              </div>

              {/* MODIFICADO: Ajuste de layout (col-span-2) */}
              <div className="md:col-span-2">
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

          {/* Detalles (sin cambios, el submit se encarga de filtrar) */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-900">Detalles (Precio, Cantidad, IVA)</h4>
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">Cantidad</label>
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


// --- Componente Principal (modificado para manejar ambos modales) ---
const Comprobantes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'remitos' | 'facturas'>('remitos');
  
  // MODIFICADO: Estados separados para cada modal
  const [showNuevaFactura, setShowNuevaFactura] = useState(false);
  const [showNuevoRemito, setShowNuevoRemito] = useState(false);

  const [facturas,setFacturas] = useState([])
  const [remitos,setRemitos] = useState([])


  const getComprobantes=async()=>{
    const req = await fetch(`${API_BASE_URL}/comprobante`,{
      method:"GET",
      headers:
        {
          "Content-Type":"application/json"
        }
    })

    const res = await req.json()
   setFacturas(res.filter((comprobante: any)=>comprobante.tipoDeComprobante.tipo==="Factura"))
   setRemitos(res.filter((comprobante: any)=>comprobante.tipoDeComprobante.tipo==="Remito"))
  }
  
  const [reloadFlag, setReloadFlag] = useState(0); 

  // MODIFICADO: Hacemos que los handlers recarguen los datos
  const handleFacturaCreada = () => {
    setReloadFlag((x) => x + 1);
    getComprobantes(); // Recargamos
  };
  
  const handleRemitoCreado = () => {
    setReloadFlag((x) => x + 1);
    getComprobantes(); // Recargamos
  };

  useEffect(()=>{
    getComprobantes()
  },[reloadFlag]) // MODIFICADO: Recargamos cuando reloadFlag cambia


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Comprobantes</h1>
            <p className="text-gray-600 mt-1">Gestiona tus remitos y facturas.</p>
          </div>

          {/* MODIFICADO: Botón condicional para Factura */}
          {activeTab === 'facturas' && (
            <button
              onClick={() => setShowNuevaFactura(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Nueva Factura
            </button>
          )}

          {/* NUEVO: Botón condicional para Remito */}
          {activeTab === 'remitos' && (
            <button
              onClick={() => setShowNuevoRemito(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Nuevo Remito
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
          {/* MODIFICADO: Eliminamos la 'key' ya que pasamos los datos como props */}
          {activeTab === 'remitos' && (
             <div>
              <Remitos remitos={remitos} />
            </div>
          )}
          {activeTab === 'facturas' && (
            <div>
              <Facturas facturas={facturas} />
            </div>
          )}
        </div>
      </div>

      {/* Renderizamos ambos modales */}
      <NuevaFacturaModal
        open={showNuevaFactura}
        onClose={() => setShowNuevaFactura(false)}
        onSuccess={handleFacturaCreada}
      />

      <NuevoRemitoModal
        open={showNuevoRemito}
        onClose={() => setShowNuevoRemito(false)}
        onSuccess={handleRemitoCreado}
      />
    </div>
  );
};

export default Comprobantes;


