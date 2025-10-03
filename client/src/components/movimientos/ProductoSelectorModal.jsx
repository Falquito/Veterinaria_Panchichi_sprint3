"use client";
import React, { useEffect, useState } from "react";
import { Package, Search, X, Check } from "lucide-react";
import { useModal } from "../ui/animated-modal"; // ajustá la ruta si cambia

export default function ProductoSelectorModal({ onSelect, selectedProductoId }) {
  const { setOpen } = useModal();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { loadProductos(); }, []);

  async function loadProductos() {
    try {
      const res = await fetch("http://localhost:3000/productos");
      const data = await res.json();
      const all = [];
      data.forEach((dep) => {
        dep.productos.forEach((p) => {
          if (!all.find((x) => x.id === p.id)) {
            all.push({
              id: p.id,
              nombre: p.nombre,
              descripcion: p.descripcion,
              categoria: p.nombreCategoria,
              precio: p.precio,
            });
          }
        });
      });
      setProductos(all);
    } catch (e) {
      console.error("Error al cargar productos:", e);
    } finally {
      setLoading(false);
    }
  }

  const productosFiltrados = productos.filter((p) =>
    (p.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.descripcion || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.categoria || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pick = (producto) => {
    onSelect(producto);
    setOpen(false);
  };

  return (
    <div className="max-w-2xl w-full max-h-[80vh] flex flex-col bg-white rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Seleccionar Producto</h3>
            <p className="text-sm text-gray-600">{productosFiltrados.length} productos disponibles</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, descripción o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No se encontraron productos</div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {productosFiltrados.map((p) => (
              <button
                key={p.id}
                onClick={() => pick(p)}
                className={`p-4 border rounded-lg text-left transition-all hover:shadow-md ${
                  selectedProductoId === p.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{p.nombre}</h4>
                        <span className="text-xs text-gray-500">ID: {p.id}</span>
                      </div>
                      {p.descripcion && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.descripcion}</p>}
                      <div className="flex items-center gap-3 mt-2">
                        {p.categoria && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {p.categoria}
                          </span>
                        )}
                        <span className="text-sm font-semibold text-green-600">
                          ${p.precio?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedProductoId === p.id && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
