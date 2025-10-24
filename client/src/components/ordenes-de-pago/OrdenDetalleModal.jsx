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
  Hash,
  Building,
  Receipt,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Componente para manejar listas de productos
const ProductosList = ({ productos }) => {
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [itemsVisibles, setItemsVisibles] = useState(6);
  
  // Determinar cuántos mostrar basado en la cantidad total
  const limite = productos.length <= 10 ? productos.length : itemsVisibles;
  const productosAMostrar = mostrarTodos ? productos : productos.slice(0, limite);
  const hayMas = productos.length > limite && !mostrarTodos;

  const toggleMostrar = () => {
    if (mostrarTodos) {
      setMostrarTodos(false);
    } else {
      setMostrarTodos(true);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Productos incluidos ({productos.length})
          </span>
        </div>
        {productos.length > 6 && (
          <button
            onClick={toggleMostrar}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            {mostrarTodos ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Mostrar menos
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Ver todos ({productos.length})
              </>
            )}
          </button>
        )}
      </div>
      
      <div className={`space-y-2 ${mostrarTodos && productos.length > 10 ? 'max-h-64 overflow-y-auto' : ''}`}>
        {productosAMostrar.map((p, i) => (
          <div
            key={i}
            className="flex items-center justify-between text-sm bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {p?.producto?.nombre || `Producto ID: ${p?.producto?.id ?? "—"}`}
                </div>
                {p?.producto?.id && p?.producto?.nombre && (
                  <div className="text-xs text-gray-500">
                    ID: {p.producto.id}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                {p?.cantidad ?? "—"} und.
              </div>
              <div className="text-xs text-gray-500">
                Cantidad
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {hayMas && (
        <div className="mt-3 text-center">
          <button
            onClick={toggleMostrar}
            className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
          >
            + Ver {productos.length - limite} productos más
          </button>
        </div>
      )}
    </div>
  );
};

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
      const response = await fetch("http://localhost:3000/orden-de-pago");
      if (!response.ok) throw new Error("Error al cargar la orden");
      const data = await response.json();

      const ordenEncontrada = Array.isArray(data)
        ? data.find((o) => o.id === ordenId)
        : data;

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
    return new Date(fecha).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
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

  const getTipoComprobanteIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case "factura":
        return <Receipt className="w-4 h-4 text-green-600" />;
      case "remito":
        return <Package className="w-4 h-4 text-blue-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTipoComprobanteBadge = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case "factura":
        return "bg-green-100 text-green-800 border-green-300";
      case "remito":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const proveedor = orden?.proveedor ?? null;
  const detalles = useMemo(
    () => (Array.isArray(orden?.detalles) ? orden.detalles : []),
    [orden]
  );

  const totalFacturas = useMemo(() => {
    return detalles.reduce((sum, d) => {
      const c = d?.comprobante;
      if (c?.tipoDeComprobante?.tipo?.toLowerCase() === "factura" && c?.total) {
        return sum + Number(c.total);
      }
      return sum;
    }, 0);
  }, [detalles]);

  const cantidadFacturas = useMemo(() => {
    return detalles.filter(d => 
      d?.comprobante?.tipoDeComprobante?.tipo?.toLowerCase() === "factura"
    ).length;
  }, [detalles]);

  const totalItems = useMemo(() => {
    return detalles.reduce((acc, d) => {
      const count = d?.comprobante?.detalles?.length ?? 0;
      return acc + count;
    }, 0);
  }, [detalles]);

  if (!ordenId) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-xl bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
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
              <p className="text-sm text-gray-600">
                {cantidadFacturas} factura(s) por {formatMoney(totalFacturas)}
              </p>
            </div>
          </div>
          {orden?.estado && (
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getEstadoBadge(orden.estado)}`}>
                {orden.estado}
              </span>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          )}
          {!orden?.estado && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
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
                {/* Resumen de la orden */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Resumen del Pago
                      </h3>
                      <p className="text-blue-700 text-sm mt-1">
                        {cantidadFacturas} facturas • {totalItems} productos • {formatFecha(orden.fecha)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-900">
                        {formatMoney(orden.montoTotal)}
                      </div>
                      <div className="text-sm text-blue-700 flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        {orden.formaDePago}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información del proveedor */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    Información del Proveedor
                  </h3>
                  {proveedor ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nombre:</span>
                          <span className="font-medium text-gray-900">
                            {proveedor.nombre || "—"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">CUIT:</span>
                          <span className="font-medium text-gray-900">
                            {proveedor.cuit || "—"}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {proveedor.email && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium text-gray-900">
                              {proveedor.email}
                            </span>
                          </div>
                        )}
                        {proveedor.telefono && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Teléfono:</span>
                            <span className="font-medium text-gray-900">
                              {proveedor.telefono}
                            </span>
                          </div>
                        )}
                      </div>
                      {proveedor.direccion && (
                        <div className="col-span-full pt-2 border-t border-gray-200">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dirección:</span>
                            <span className="font-medium text-gray-900 text-right">
                              {proveedor.direccion}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Sin datos del proveedor</div>
                  )}
                </div>

                {/* Facturas incluidas */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Receipt className="w-5 h-5" />
                      Facturas Incluidas
                    </h3>
                    <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      Total: {formatMoney(totalFacturas)}
                    </div>
                  </div>

                  {detalles.length === 0 ? (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No hay facturas asociadas</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {detalles.map((detalle, idx) => {
                        const c = detalle?.comprobante || null;
                        const productos = Array.isArray(c?.detalles) ? c.detalles : [];
                        const tipoComprobante = c?.tipoDeComprobante?.tipo || "Sin tipo";
                        const esFactura = tipoComprobante.toLowerCase() === "factura";
                        
                        return (
                          <div
                            key={c?.id ?? idx}
                            className={`border-2 rounded-lg p-5 transition-all ${
                              esFactura 
                                ? "bg-green-50 border-green-200 hover:border-green-300" 
                                : "bg-white border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start gap-3">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                                  esFactura 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-blue-100 text-blue-700"
                                }`}>
                                  {getTipoComprobanteIcon(tipoComprobante)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-bold text-lg text-gray-900">
                                      {c ? `Comprobante #${c.id}` : "Comprobante"}
                                    </h4>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTipoComprobanteBadge(tipoComprobante)}`}>
                                      {tipoComprobante}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Total de la factura prominente */}
                              {esFactura && c?.total && (
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-green-700">
                                    {formatMoney(c.total)}
                                  </div>
                                  <div className="text-sm text-green-600">
                                    Total factura
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Información de la factura */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <div>
                                  <div className="text-xs text-gray-500">Fecha</div>
                                  <div className="font-medium text-gray-900">
                                    {c?.fecha ? formatFecha(c.fecha) : "—"}
                                  </div>
                                </div>
                              </div>
                              
                              {c?.numero && (
                                <div className="flex items-center gap-2">
                                  <Hash className="w-4 h-4 text-gray-400" />
                                  <div>
                                    <div className="text-xs text-gray-500">Número</div>
                                    <div className="font-medium text-gray-900">
                                      {c.numero}
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Tipo de factura */}
                              {esFactura && c?.tipoFactura && (
                                <div className="flex items-center gap-2">
                                  <Receipt className="w-4 h-4 text-gray-400" />
                                  <div>
                                    <div className="text-xs text-gray-500">Tipo</div>
                                    <div className="font-medium text-gray-900">
                                      Factura {typeof c.tipoFactura === 'object' ? c.tipoFactura.tipo : c.tipoFactura}
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2">
                                <Building className="w-4 h-4 text-gray-400" />
                                <div>
                                  <div className="text-xs text-gray-500">Depósito</div>
                                  <div className="font-medium text-gray-900">
                                    {c?.deposito?.nombre || "—"}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Productos de la factura */}
                            {productos.length > 0 && (
                              <ProductosList productos={productos} />
                            )}

                            {/* Observaciones si existen */}
                            {c?.observaciones && (
                              <div className="border-t border-gray-200 pt-4 mt-4">
                                <div className="text-sm">
                                  <span className="font-medium text-gray-700">Observaciones:</span>
                                  <p className="text-gray-600 mt-1">{c.observaciones}</p>
                                </div>
                              </div>
                            )}
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