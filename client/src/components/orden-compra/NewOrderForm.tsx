"use client";
import React from "react";
import { Building2, Download, Package, Plus, Trash2 } from "lucide-react";
import { type ProductoOrden, type Proveedor } from "../../types/orden-de-compra";

export default function NewOrderForm({
  nroOrden,
  proveedor,
  lineas,
  total,
  loading,
  error,
  success,
  onAgregarLinea,
  onEliminarLinea,
  onCambiarCantidad,
  onCambiarPrecio,
  onPickProveedor,
  onPickProducto,
  onCrear,
}: {
  nroOrden: string;
  proveedor: Proveedor | null;
  lineas: ProductoOrden[];
  total: number;
  loading: boolean;
  error: string;
  success: string;
  onAgregarLinea: () => void;
  onEliminarLinea: (index: number) => void;
  onCambiarCantidad: (index: number, cantidad: number) => void;
  onCambiarPrecio: (index: number, precio: number) => void;
  onPickProveedor: () => void;
  onPickProducto: (index: number) => void;
  onCrear: () => void;
}) {
  return (
    <>
      {/* Encabezado + proveedor */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-gray-900">Nueva Orden de Compra</h2>
          <div className="text-sm text-gray-500">N° {nroOrden}</div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Proveedor
            </h3>
            <button
              onClick={onPickProveedor}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-lg font-medium"
            >
              <Building2 className="mr-2 h-5 w-5 inline" />
              Seleccionar Proveedor
            </button>
          </div>

          {proveedor ? (
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="font-medium text-gray-900 mb-2">{proveedor.nombre}</div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• CUIT: {proveedor.cuit || "No disponible"}</div>
                <div>• Email: {proveedor.email || "No disponible"}</div>
                <div>• Teléfono: {proveedor.telefono || "No disponible"}</div>
                {proveedor.direccion && <div>• Dirección: {proveedor.direccion}</div>}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
              <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <div className="text-gray-500 font-medium">No se ha seleccionado ningún proveedor</div>
              <div className="text-sm text-gray-400 mt-1">Haz clic en “Seleccionar Proveedor”.</div>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de líneas */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Productos
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lineas.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onPickProducto(i)}
                      className="text-left w-full p-3 border border-gray-300 rounded-md hover:border-gray-500 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
                    >
                      {item.producto ? (
                        <div>
                          <div className="font-medium text-gray-900">{item.producto.nombre}</div>
                          <div className="text-sm text-gray-500">{item.descripcion}</div>
                          {item.producto.categoria && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                              {item.producto.categoria}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-500 flex items-center">
                          <Package className="mr-2 h-4 w-4" />
                          Seleccionar producto...
                        </div>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min={1}
                      value={item.cantidad}
                      onChange={(e) => onCambiarCantidad(i, parseInt(e.target.value) || 0)}
                      className="w-20 p-2 border border-gray-300 rounded-md text-center focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.precioUnitario}
                      onChange={(e) => onCambiarPrecio(i, parseFloat(e.target.value) || 0)}
                      className="w-24 p-2 border border-gray-300 rounded-md text-right focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                      disabled={!!item.producto}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">${item.subtotal.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onEliminarLinea(i)}
                      disabled={lineas.length === 1}
                      className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onAgregarLinea}
              className="flex items-center text-black hover:text-gray-800 font-medium border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar producto
            </button>
            <div className="bg-black text-white px-6 py-3 rounded-lg">
              <div className="text-sm opacity-80">Total de la Orden</div>
              <div className="text-2xl font-bold">${total.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onCrear}
              className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-lg transition-colors"
              disabled={loading || !proveedor}
            >
              {loading ? "Registrando..." : "Registrar Orden"}
            </button>
         
          </div>

          {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}
          {success && <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">{success}</div>}
        </div>
      </div>
    </>
  );
}
