import React, { useState, useEffect } from 'react';
import { Search, X, Check, User, Phone, Mail, MapPin } from 'lucide-react';

const ProveedorSelector = ({ onSelect, onClose, selectedProveedorId }) => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      const response = await fetch('http://localhost:3000/proveedores');
      const data = await response.json();
      setProveedores(data.items || []);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const proveedoresFiltrados = proveedores.filter(p =>
    (p.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.cuit || '').includes(searchTerm) ||
    (p.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 backdrop-blur-xl bg-opacity-50 flex items-center justify-center p-4 z-[60]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Seleccionar Proveedor</h3>
              <p className="text-sm text-gray-600">{proveedoresFiltrados.length} proveedores disponibles</p>
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
              placeholder="Buscar por nombre, CUIT o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : proveedoresFiltrados.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No se encontraron proveedores
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {proveedoresFiltrados.map((proveedor) => (
                <div
                  key={proveedor.id_proveedor}
                  onClick={() => onSelect(proveedor)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg ${
                    selectedProveedorId === proveedor.id_proveedor
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-green-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{proveedor.nombre}</h4>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            proveedor.activo 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {proveedor.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          {proveedor.cuit && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">CUIT:</span>
                              <span>{proveedor.cuit}</span>
                            </div>
                          )}
                          
                          {proveedor.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span>{proveedor.email}</span>
                            </div>
                          )}
                          
                          {proveedor.telefono && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{proveedor.telefono}</span>
                            </div>
                          )}
                          
                          {proveedor.direccion && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="line-clamp-1">{proveedor.direccion}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {selectedProveedorId === proveedor.id_proveedor && (
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
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

export default ProveedorSelector;