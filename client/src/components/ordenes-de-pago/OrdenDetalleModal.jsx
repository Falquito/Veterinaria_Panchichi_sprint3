import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  FileText,
  Calendar,
  DollarSign,
  User,
  CreditCard,
  Package,
  AlertCircle,
  Loader,
} from "lucide-react";

const OrdenDetalleModal = ({ ordenId, onClose }) => {
  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(Boolean(ordenId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ordenId) return;
    loadOrden();
  }, [ordenId]);

  const loadOrden = async () => {
    setLoading(true);
    setError(null);
    try {
      // Back actual: trae la lista completa y filtramos
      const response = await fetch("http://localhost:3000/orden-de-pago");
      // Si luego exponés GET /orden-de-pago/:id -> reemplazar por:
      // const response = await fetch(`http://localhost:3001/orden-de-pago/${ordenId}`);

      if (!response.ok) throw new Error("Error al cargar la orden");
      const data = await response.json();

      const ordenEncontrada = Array.isArray(data)
        ? data.find((o) => o.id === ordenId)
        : data; // por si en el futuro ya devuelve una sola

      if (!ordenEncontrada) throw new Error("Orden no encontrada");
      setOrden(ordenEncontrada);
    } catch (err) {
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "Sin fecha";
    return new Date(fecha).toLocaleString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMoney = (v) => {
    if (v === null || v === undefined || v === "") return "—";
    const num = typeof v === "string" ? Number(v) : v;
    if (Number.isNaN(num)) return String(v);
    return num.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    });
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Pagado":
        return "bg-green-100 text-green-800 border-green-300";
      case "Anulado":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const proveedor = orden?.proveedor ?? null;
  const detalles = useMemo(
    () => (Array.isArray(orden?.detalles) ? orden.detalles : []),
    [orden]
  );

  const totalItems = useMemo(() => {
    return detalles.reduce((acc, d) => {
      const count = d?.comprobante?.detalles?.length ?? 0;
      return acc + count;
    }, 0);
  }, [detalles]);

  if (!ordenId) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-xl  bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Orden de Pago #{ordenId}
              </h2>
              <p className="text-sm text-gray-600">Detalle completo de la orden</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-8 h-8 text-blue-600 animate-spin mb-3" />
              <p className="text-gray-600">Cargando detalles...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          ) : (
            orden && (
              <div className="space-y-6">
                {/* Información general */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Información
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha</span>
                        <span className="font-medium text-gray-900">
                          {formatFecha(orden.fecha)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Forma de pago</span>
                        <span className="inline-flex items-center gap-1 font-medium text-gray-900">
                          <CreditCard className="w-4 h-4 text-gray-500" />
                          {orden.formaDePago || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monto total</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-gray-900">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          {formatMoney(orden.montoTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Proveedor */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      Proveedor
                    </h3>
                    {proveedor ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nombre</span>
                          <span className="font-medium text-gray-900">
                            {proveedor.nombre || "—"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">CUIT</span>
                          <span className="font-medium text-gray-900">
                            {proveedor.cuit || "—"}
                          </span>
                        </div>
                        {proveedor.email && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email</span>
                            <span className="font-medium text-gray-900">
                              {proveedor.email}
                            </span>
                          </div>
                        )}
                        {proveedor.telefono && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Teléfono</span>
                            <span className="font-medium text-gray-900">
                              {proveedor.telefono}
                            </span>
                          </div>
                        )}
                        {proveedor.direccion && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dirección</span>
                            <span className="font-medium text-gray-900 text-right">
                              {proveedor.direccion}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Sin datos</div>
                    )}
                  </div>
                </div>

                {/* Detalles / Comprobantes */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Comprobantes vinculados
                    </h3>
                    <div className="text-sm text-gray-600">
                      {detalles.length} comprobante(s)
                      {totalItems > 0 ? ` · ${totalItems} item(s)` : ""}
                    </div>
                  </div>

                  {detalles.length === 0 ? (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No hay comprobantes asociados</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {detalles.map((detalle, idx) => {
                        const c = detalle?.comprobante || null;
                        const productos = Array.isArray(c?.detalles) ? c.detalles : [];
                        return (
                          <div
                            key={c?.id ?? idx}
                            className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-semibold">
                                  {idx + 1}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <div className="font-semibold text-gray-900">
                                      {c ? `Comprobante #${c.id}` : "Comprobante"}
                                    </div>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                      {c?.tipoDeComprobante?.nombre || "Sin tipo"}
                                    </span>
                                  </div>
                                  <div className="mt-1 grid grid-cols-2 gap-4 text-sm">
                                    <div className="text-gray-600">
                                      <span className="text-gray-500">Fecha:</span>{" "}
                                      <span className="text-gray-900">
                                        {c?.fecha ? formatFecha(c.fecha) : "—"}
                                      </span>
                                    </div>
                                    <div className="text-gray-600">
                                      <span className="text-gray-500">Depósito:</span>{" "}
                                      <span className="text-gray-900">
                                        {c?.deposito?.nombre || "—"}
                                      </span>
                                    </div>
                                    <div className="col-span-2 text-gray-600">
                                      <span className="text-gray-500">Productos:</span>{" "}
                                      <span className="text-gray-900">
                                        {productos.length} item(s)
                                      </span>
                                    </div>
                                  </div>

                                  {productos.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                      <div className="text-xs text-gray-500 mb-2">
                                        Productos incluidos:
                                      </div>
                                      <div className="space-y-1">
                                        {productos.slice(0, 5).map((p, i) => (
                                          <div
                                            key={i}
                                            className="flex items-center justify-between text-sm"
                                          >
                                            <span className="flex items-center gap-2 text-gray-700">
                                              <Package className="w-4 h-4 text-gray-400" />
                                              {p?.producto?.nombre
                                                ? `${p.producto.nombre} (ID ${p.producto.id ?? "—"})`
                                                : `Producto ID: ${p?.producto?.id ?? "—"}`}
                                            </span>
                                            <span className="font-medium text-gray-900">
                                              {p?.cantidad ?? "—"} und.
                                            </span>
                                          </div>
                                        ))}
                                        {productos.length > 5 && (
                                          <div className="text-xs text-gray-500 italic">
                                            + {productos.length - 5} más…
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdenDetalleModal;
