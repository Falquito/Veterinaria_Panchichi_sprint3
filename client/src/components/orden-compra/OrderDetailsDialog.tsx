"use client";
import React from "react";
import { Calendar, Package, X, Building2, DollarSign } from "lucide-react";
import {type OrdenDeCompra } from "../../types/orden-de-compra";

export default function OrderDetailsDialog({
  open, orden, onClose,
}: { open: boolean; orden: OrdenDeCompra | null; onClose: () => void; }) {
  if (!open || !orden) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-black px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              <div>
                <h3 className="text-lg font-medium">Detalles de Orden #{orden.id_oc}</h3>
                <p className="text-gray-300 text-sm">Información completa de la orden</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-300">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(90vh - 80px)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Información de la Orden
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium">#{orden.id_oc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">{orden.fecha}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-green-600 text-lg">
                    ${parseFloat(orden.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Proveedor
              </h4>
              <div className="space-y-3">
                <div><span className="text-gray-600 block">Nombre:</span><span className="font-medium">{orden.proveedor.nombre}</span></div>
                <div><span className="text-gray-600 block">CUIT:</span><span className="font-medium">{orden.proveedor.cuit || "No disponible"}</span></div>
                <div><span className="text-gray-600 block">Email:</span><span className="font-medium">{orden.proveedor.email || "No disponible"}</span></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Productos
            </h4>
            <div className="space-y-4">
              {orden.productos.map((it, i) => (
                <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{it.producto.nombre}</h5>
                      {it.producto.descripcion && <p className="text-sm text-gray-600 mt-1">{it.producto.descripcion}</p>}
                      {it.producto.categoria?.nombre && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                          {it.producto.categoria.nombre}
                        </span>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm text-gray-600">Cantidad</div>
                      <div className="font-bold text-lg">{it.cantidad}</div>
                      <div className="text-sm text-gray-600">Precio: ${it.producto.precio.toFixed(2)}</div>
                      <div className="font-medium text-green-600">
                        Subtotal: {(it.cantidad * it.producto.precio).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-black text-white rounded-lg p-6 flex justify-between">
              <h4 className="text-lg font-semibold">Total</h4>
              <div className="text-2xl font-bold">${parseFloat(orden.total).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
