import React, { useState, useEffect } from 'react';
import { Search, X, Check, FileText, Calendar, Package, Warehouse } from 'lucide-react';

const ComprobanteSelector = ({ onSelect, onClose, selectedComprobanteId, proveedorId }) => {
  const [comprobantes, setComprobantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadComprobantes();
  }, []);

  const loadComprobantes = async () => {
    try {
      const response = await fetch('http://localhost:3000/comprobante');
      const data = await response.json();
      
      // Filtrar comprobantes del proveedor seleccionado
      const comprobantesFiltrados = (data || []).filter(c => 
        c.proveedor?.id_proveedor === proveedorId
      );
      
      setComprobantes(comprobantesFiltrados);
    } catch (error) {
      console.error('Error al cargar comprobantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const comprobantesFiltrados = comprobantes.filter(c =>
    c.id.toString().includes(searchTerm) ||
    (c.tipoDeComprobante?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.deposito?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleDateString('es-AR');
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xl bg-opacity-50 flex items-center justify-center p-4 z-[60]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Seleccionar Comprobante</h3>
              <p className="text-sm text-gray-600">{comprobantesFiltrados.length} comprobantes del proveedor</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ID, tipo o depósito..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : comprobantesFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {comprobantes.length === 0 
                  ? 'No hay comprobantes para este proveedor' 
                  : 'No se encontraron comprobantes con los filtros aplicados'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {comprobantesFiltrados.map((comprobante) => (
                <div
                  key={comprobante.id}
                  onClick={() => onSelect(comprobante)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg ${
                    selectedComprobanteId === comprobante.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            Comprobante #{comprobante.id}
                          </h4>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {comprobante.tipoDeComprobante?.nombre || 'Sin tipo'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatFecha(comprobante.fecha)}</span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Warehouse className="w-4 h-4 text-gray-400" />
                            <span>{comprobante.deposito?.nombre || 'Sin depósito'}</span>
                          </div>

                          <div className="col-span-2 flex items-center gap-2 text-gray-600">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span>
                              {comprobante.detalles?.length || 0} producto(s)
                            </span>
                          </div>

                          {comprobante.ordenDeCompra && (
                            <div className="col-span-2 flex items-center gap-2 text-gray-600">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-xs">
                                OC #{comprobante.ordenDeCompra.id_oc}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Detalles expandibles */}
                        {comprobante.detalles && comprobante.detalles.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="text-xs text-gray-500 mb-2">Productos incluidos:</div>
                            <div className="space-y-1">
                              {comprobante.detalles.slice(0, 3).map((detalle, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-700">
                                    Producto ID: {detalle.producto?.id || 'N/A'}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {detalle.cantidad} und.
                                  </span>
                                </div>
                              ))}
                              {comprobante.detalles.length > 3 && (
                                <div className="text-xs text-gray-500 italic">
                                  + {comprobante.detalles.length - 3} más...
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedComprobanteId === comprobante.id && (
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
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

export default ComprobanteSelector;