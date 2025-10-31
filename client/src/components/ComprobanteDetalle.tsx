import React from "react";
import {
  X,
  FileText,
  Truck,
  User,
  Calendar,
  Building2,
  Package,
  Hash,
  Receipt,
  Tag,
} from "lucide-react";
import type { Factura, Remito } from "../types/comprobantes";

type ComprobanteDetalle = Factura | Remito;

interface ComprobanteDetalleModalProps {
  open: boolean;
  onClose: () => void;
  comprobante: ComprobanteDetalle | null;
  tipo: "factura" | "remito";
}

export const ComprobanteDetalleModal: React.FC<
  ComprobanteDetalleModalProps
> = ({ open, onClose, comprobante, tipo }) => {
  if (!open || !comprobante) return null;

  const config = {
    factura: {
      title: "Detalle de Factura",
      icon: <FileText className="w-5 h-5 text-white" />,
      bgColor: "bg-blue-500",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    remito: {
      title: "Detalle de Remito",
      icon: <Truck className="w-5 h-5 text-white" />,
      bgColor: "bg-emerald-500",
      lightBg: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
    },
  };

  const currentConfig = config[tipo];

  return (
    <>
      {/* Fondo */}
      <div
        className={`fixed inset-0 fixed inset-0 backdrop-blur-sm bg-white/10 transition-all duration-300 z-50 transition-opacity duration-300 z-50 ${
          open ? "bg-opacity-50" : "bg-opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div
          className={`bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
            open ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 ${currentConfig.bgColor} rounded-lg flex items-center justify-center`}
              >
                {currentConfig.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {currentConfig.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {tipo === "factura"
                    ? `Factura #${(comprobante as Factura).numero}`
                    : `Remito #${(comprobante as Remito).id_remito ?? "N/A"}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
            {/* Resumen */}
            <div
              className={`${currentConfig.lightBg} rounded-lg p-4 border ${currentConfig.borderColor}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {tipo === "factura"
                      ? "Resumen de la Factura"
                      : "Resumen del Remito"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {("detalles" in comprobante &&
                      `${comprobante.detalles?.length || 0} ${
                        comprobante.detalles?.length === 1
                          ? "producto"
                          : "productos"
                      } • `) ||
                      ""}
                    {new Date(comprobante.fecha).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* ✅ Solo mostrar total si es factura */}
                {tipo === "factura" && "total" in comprobante && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      $
                      {comprobante.total?.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      }) || "0.00"}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Total
                    </p>
                  </div>
                )}

     

              </div>
            </div>

            {/* Información del proveedor */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-600" />
                Información del Proveedor
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                      Nombre
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {comprobante.proveedor?.nombre || "Sin nombre"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                      ID
                    </p>
                    <p className="text-sm text-gray-700">
                      {comprobante.proveedor?.id_proveedor || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ SOLO si es factura */}
            {tipo === "factura" && "detalles" in comprobante && (
              <>
                {/* Detalles de la factura */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Receipt className="w-5 h-5 mr-2 text-gray-600" />
                    Detalles de la Factura
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                          Fecha
                        </p>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(
                              comprobante.fecha
                            ).toLocaleDateString("es-AR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                          Depósito
                        </p>
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-700">
                            {comprobante.deposito?.nombre || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                          Tipo de Comprobante
                        </p>
                        <div className="flex items-center space-x-2">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                            {comprobante.tipoDeComprobante?.tipo || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                          Número de Factura
                        </p>
                        <div className="flex items-center space-x-2">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <p className="text-sm font-semibold text-gray-900">
                            {comprobante.numero}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Productos */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-gray-600" />
                    Productos incluidos ({comprobante.detalles?.length || 0})
                  </h4>
                  {comprobante.detalles?.length ? (
                    <div className="space-y-3">
                      {comprobante.detalles.map((detalle, index) => (
                        <div
                          key={detalle.id || index}
                          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {detalle.producto?.nombre ||
                                    "Producto sin nombre"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ID: {detalle.producto?.id || "N/A"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                {detalle.cantidad} und.
                              </p>
                              <p className="text-xs text-gray-500 uppercase tracking-wider">
                                Cantidad
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-200">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">
                        No hay productos registrados
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ✅ Si es remito: mostrar productos también */}
            {tipo === "remito" && (
              <>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-gray-600" />
                    Información del Remito
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                          Fecha
                        </p>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(comprobante.fecha).toLocaleDateString(
                              "es-AR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      {"ordenDeCompra" in comprobante &&
                        comprobante.ordenDeCompra && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                              Orden de Compra
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              OC #{comprobante.ordenDeCompra.id_oc}
                            </p>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* ✅ Productos entregados */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-gray-600" />
                      Productos entregados ({comprobante.detalles?.length || 0})
                    </h4>

                    {comprobante.detalles?.length ? (
                      <div className="space-y-3">
                        {comprobante.detalles.map((detalle, index) => (
                          <div
                            key={detalle.id || index}
                            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                  <Package className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {detalle.producto?.nombre ||
                                      "Producto sin nombre"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    ID: {detalle.producto?.id || "N/A"}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">
                                  {detalle.cantidad} und.
                                </p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">
                                  Cantidad
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-200">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">
                          No hay productos registrados
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 p-4 bg-gray-50">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComprobanteDetalleModal;
