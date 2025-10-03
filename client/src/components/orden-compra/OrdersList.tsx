"use client";
import React from "react";
import { DollarSign, Package, Calendar } from "lucide-react";
import { type OrdenDeCompra } from "../../types/orden-de-compra";

export default function OrdersList({
  ordenes,
  onVerDetalle,
}: {
  ordenes: OrdenDeCompra[];
  onVerDetalle: (oc: OrdenDeCompra) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium">Historial de Órdenes</h3>
        <p className="text-sm text-gray-500 mt-1">{ordenes.length} órdenes registradas</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Orden</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Productos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ordenes.map((orden) => (
              <tr
                key={orden.id_oc}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onVerDetalle(orden)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="font-medium text-gray-900">#{orden.id_oc}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 inline" />
                  {orden.fecha}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{orden.proveedor.nombre}</div>
                    <div className="text-sm text-gray-500">{orden.proveedor.cuit}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {orden.productos.map((item, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium">{item.producto.nombre}</span>
                        <span className="text-gray-500 ml-2">x{item.cantidad}</span>
                        {item.producto.categoria?.nombre && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ml-2">
                            {item.producto.categoria.nombre}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                    <span className="font-semibold text-gray-900">
                      ${parseFloat(orden.total).toFixed(2)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!ordenes.length && (
          <div className="p-8 text-center text-gray-500">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <div className="text-lg font-medium">No hay órdenes registradas</div>
            <div className="text-sm">Crea tu primera orden desde “Nueva Orden”.</div>
          </div>
        )}
      </div>
    </div>
  );
}
