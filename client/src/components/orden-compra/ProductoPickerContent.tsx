"use client";
import React from "react";
import { Package, Search } from "lucide-react";
import type { Producto } from "../../types/orden-de-compra";

export default function ProductoPickerContent({
  productos, total, q, onQChange, onSelect,
}: {
  productos: Producto[]; total: number; q: string;
  onQChange: (v: string) => void; onSelect: (p: Producto) => void;
}) {
  return (
    <div
      className="w-full max-w-5xl pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Package className="h-6 w-6 mr-3 text-gray-700" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Catálogo de Productos</h3>
            <p className="text-gray-600">Selecciona los productos para tu orden</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text" placeholder="Buscar productos por nombre..."
            value={q} onChange={(e) => onQChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
          />
        </div>
        <div className="mt-2 flex justify-between text-sm text-gray-500">
          <span>{productos.length} de {total} productos</span>
          <span>
            Disponibles: {productos.filter(p => p.stock > 0).length} • Sin stock: {productos.filter(p => p.stock === 0).length}
          </span>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {productos.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productos.map((p) => (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onMouseDown={() => onSelect(p)}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{p.nombre}</h4>
                    {p.descripcion && <p className="text-sm text-gray-600 mb-2 line-clamp-2">{p.descripcion}</p>}
                    {p.categoria && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {p.categoria}
                      </span>
                    )}
                  </div>
                  <div className="ml-2">
                    {p.stock > 0 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Disponible
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Sin stock
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="text-lg font-semibold text-gray-700">${p.precio.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">Stock: {p.stock}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-500">{q ? "Intenta con otros términos" : "No hay productos disponibles"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
