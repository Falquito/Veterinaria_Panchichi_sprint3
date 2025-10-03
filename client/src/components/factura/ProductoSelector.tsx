import React, { useEffect, useMemo, useState } from 'react';
import { Search, X, Check, Package2, Hash, DollarSign } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export type Producto = {
  id: number;
  nombre?: string;
  sku?: string;
  precio?: number;
};

type Props = {
  open: boolean;
  selectedId?: number | null;
  onSelect: (p: Producto) => void;
  onClose: () => void;
};

export const ProductoSelector: React.FC<Props> = ({ open, onSelect, onClose, selectedId }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState('');

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/productos`);
        const data = await res.json();
        setProductos(Array.isArray(data) ? data : (data?.items ?? []));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open]);

  const list = useMemo(() => {
    const t = term.toLowerCase();
    return productos.filter(
      (p) =>
        p.id?.toString().includes(term) ||
        (p.nombre || '').toLowerCase().includes(t) ||
        (p.sku || '').toLowerCase().includes(t)
    );
  }, [productos, term]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Package2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Seleccionar Producto</h3>
              <p className="text-sm text-gray-600">{list.length} resultado(s)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Buscar por ID, nombre o SKU..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : list.length === 0 ? (
            <div className="text-center text-gray-500 py-10">No se encontraron productos.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {list.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelect(p)}
                  className={`text-left p-4 border-2 rounded-lg transition-all hover:shadow ${
                    selectedId === p.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{p.nombre || `Producto #${p.id}`}</span>
                        {p.sku && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">{p.sku}</span>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-gray-600 flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-400" /> {p.id}
                        {p.precio != null && (
                          <>
                            <DollarSign className="w-4 h-4 text-gray-400 ml-3" /> {p.precio}
                          </>
                        )}
                      </div>
                    </div>
                    {selectedId === p.id && (
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
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
    </div>
  );
};
