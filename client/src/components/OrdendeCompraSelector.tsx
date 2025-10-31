import React, { useState, useEffect } from 'react';
import { Search, FileText, X, Calendar, DollarSign, Package } from 'lucide-react';
import { fetchOrdenes } from '../services/orden-de-compraService';
import type { OrdenDeCompra } from '../types/orden-de-compra';

interface OrdenDeCompraSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (orden: OrdenDeCompra) => void;
  proveedorId?: number;
  selectedOrdenId?: number;
}

export const OrdenDeCompraSelector: React.FC<OrdenDeCompraSelectorProps> = ({
  open,
  onClose,
  onSelect,
  proveedorId,
  selectedOrdenId
}) => {
  const [ordenes, setOrdenes] = useState<OrdenDeCompra[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrdenes, setFilteredOrdenes] = useState<OrdenDeCompra[]>([]);

  useEffect(() => {
    if (open) {
      loadOrdenes();
    }
  }, [open]);

  useEffect(() => {
    let filtered = ordenes;
    
    // Filtrar por proveedor si está seleccionado
    if (proveedorId) {
      filtered = filtered.filter(orden => orden.proveedor.id_proveedor === proveedorId);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(orden =>
        orden.id_oc.toString().includes(searchTerm) ||
        orden.fecha.includes(searchTerm) ||
        orden.productos.some(p => 
          p.producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    setFilteredOrdenes(filtered);
  }, [searchTerm, ordenes, proveedorId]);

  const loadOrdenes = async () => {
    setLoading(true);
    try {
      const ordenesData = await fetchOrdenes();
      setOrdenes(ordenesData);
    } catch (error) {
      console.error('Error loading ordenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (orden: OrdenDeCompra) => {
    onSelect(orden);
    onClose();
  };

  const formatDate = (dateString: string) => {
    // Convertir formato DD-MM-YY a formato legible
    const [day, month, year] = dateString.split('-');
    return `${day}/${month}/20${year}`;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-orange-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Seleccionar Orden de Compra</h3>
              <p className="text-sm text-gray-500">
                {filteredOrdenes.length} órdenes {proveedorId ? 'del proveedor' : 'disponibles'}
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

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por ID, fecha o producto..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          ) : filteredOrdenes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No se encontraron órdenes de compra' : 
                 proveedorId ? 'Este proveedor no tiene órdenes de compra' : 
                 'No hay órdenes de compra disponibles'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrdenes.map((orden) => (
                <div
                  key={orden.id_oc}
                  onClick={() => handleSelect(orden)}
                  className={`
                    border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
                    ${selectedOrdenId === orden.id_oc 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-orange-300'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-orange-600" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Orden de Compra #{orden.id_oc}
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{formatDate(orden.fecha)}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <span>Total: ${Number(orden.total).toLocaleString('es-AR')}</span>
                          </div>
                        </div>

                        {!proveedorId && (
                          <div className="mb-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                              {orden.proveedor.nombre}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Productos */}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center mb-2">
                      <Package className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Productos ({orden.productos.length})
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {orden.productos.slice(0, 3).map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="flex-1">
                            <span className="font-medium text-gray-900">{item.producto.nombre}</span>
                            {item.producto.categoria && (
                              <span className="text-gray-500 ml-2">
                                • {item.producto.categoria.nombre}
                              </span>
                            )}
                          </div>
                          <div className="text-gray-600">
                            Cant: {item.cantidad} • ${item.producto.precio.toLocaleString('es-AR')}
                          </div>
                        </div>
                      ))}
                      
                      {orden.productos.length > 3 && (
                        <div className="text-xs text-gray-500 italic">
                          Y {orden.productos.length - 3} productos más...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};