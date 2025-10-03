"use client";
import React, { useEffect, useState } from "react";
import { Package, Calendar, FileText, ArrowDown, TrendingUp, X, AlertCircle } from "lucide-react";
import { useModal } from "../ui/animated-modal"; 

export default function MovimientoDetalleContent({ movimientoId }) {
  const { setOpen } = useModal();
  const [movimiento, setMovimiento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { if (movimientoId) loadMovimiento(); }, [movimientoId]);

  async function loadMovimiento() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/api/movimientos/${movimientoId}`);
      if (!res.ok) throw new Error("Error al cargar el movimiento");
      const data = await res.json();
      setMovimiento(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const formatFecha = (texto, normalizada) =>
    normalizada
      ? new Date(normalizada).toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })
      : (texto || "Sin fecha");

  const getTipoLabel = (t) => (t === "INS" ? "Ingreso" : t === "OUT" ? "Salida" : t === "UPD" ? "Actualización" : t);
  const getTipoBadge = (t) =>
    t === "INS" ? "bg-green-100 text-green-800" :
    t === "OUT" ? "bg-red-100 text-red-800" :
    t === "UPD" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800";
  const getTipoIcon = (t) =>
    t === "INS" ? <TrendingUp className="w-5 h-5" /> :
    t === "OUT" ? <ArrowDown className="w-5 h-5" /> :
    <Package className="w-5 h-5" />;

  if (!movimientoId) return null;

  return (
    <div className="max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Movimiento #{movimientoId}</h2>
            <p className="text-sm text-gray-600">Detalle completo del movimiento</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-gray-600">Cargando detalles...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        ) : movimiento ? (
          <div className="space-y-6">
            {/* Info General */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getTipoBadge(movimiento.tipo)}`}>{getTipoIcon(movimiento.tipo)}</div>
                  <div>
                    <p className="text-sm text-gray-600">Tipo de Movimiento</p>
                    <p className="font-semibold text-gray-900">{getTipoLabel(movimiento.tipo)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg"><Calendar className="w-5 h-5 text-blue-600" /></div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha</p>
                    <p className="font-semibold text-gray-900">
                      {formatFecha(movimiento.fecha_texto, movimiento.fecha_normalizada)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg"><FileText className="w-5 h-5 text-purple-600" /></div>
                  <div>
                    <p className="text-sm text-gray-600">Motivo</p>
                    <p className="font-semibold text-gray-900">{movimiento.motivo || "Sin especificar"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg"><Package className="w-5 h-5 text-orange-600" /></div>
                  <div>
                    <p className="text-sm text-gray-600">Total de Líneas</p>
                    <p className="font-semibold text-gray-900">{movimiento.lineas?.length || 0} productos</p>
                  </div>
                </div>
              </div>
              {movimiento.observaciones && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Observaciones</p>
                  <p className="text-gray-900">{movimiento.observaciones}</p>
                </div>
              )}
            </div>

            {/* Líneas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle de Productos</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Línea</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Depósito</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {movimiento.lineas?.length ? movimiento.lineas.map((l) => (
                      <tr key={l.linea_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-medium text-gray-900">#{l.linea_id}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                              <Package className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm text-gray-900">Producto ID: {l.producto_id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Depósito {l.deposito_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                            {l.cantidad} unidades
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No hay líneas registradas</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {movimiento.lineas?.length > 0 && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">Total de unidades:</span>
                    <span className="text-lg font-bold text-blue-900">
                      {movimiento.lineas.reduce((sum, l) => sum + l.cantidad, 0)} unidades
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-6">
        <button onClick={() => setOpen(false)} className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors">
          Cerrar
        </button>
      </div>
    </div>
  );
}
