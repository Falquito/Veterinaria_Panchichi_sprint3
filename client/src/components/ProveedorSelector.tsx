import React, { useState, useEffect } from 'react';
import { Search, User, X, Mail, Phone, MapPin } from 'lucide-react';
import { proveedoresService } from '../services/proveedoresService';
import type { Proveedor } from '../types/proveedor';

interface ProveedorSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (proveedor: Proveedor) => void;
  selectedProveedorId?: number;
}

export const ProveedorSelector: React.FC<ProveedorSelectorProps> = ({
  open,
  onClose,
  onSelect,
  selectedProveedorId
}) => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProveedores, setFilteredProveedores] = useState<Proveedor[]>([]);

  useEffect(() => {
    if (open) {
      loadProveedores();
    }
  }, [open]);

  useEffect(() => {
    const filtered = proveedores.filter(proveedor =>
      proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.cuit?.includes(searchTerm) ||
      proveedor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProveedores(filtered);
  }, [searchTerm, proveedores]);

  const loadProveedores = async () => {
    setLoading(true);
    try {
      const response = await proveedoresService.getProveedores({ limit: 100 });
      setProveedores(response.items || []); // Cambiado de 'proveedores' a 'items'
    } catch (error) {
      console.error('Error loading proveedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (proveedor: Proveedor) => {
    onSelect(proveedor);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-green-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Seleccionar Proveedor</h3>
              <p className="text-sm text-gray-500">
                {filteredProveedores.length} proveedores disponibles
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
              placeholder="Buscar por nombre, CUIT o email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
            </div>
          ) : filteredProveedores.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No se encontraron proveedores' : 'No hay proveedores disponibles'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProveedores.map((proveedor) => (
                <div
                  key={proveedor.id_proveedor}
                  onClick={() => handleSelect(proveedor)}
                  className={`
                    border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
                    ${selectedProveedorId === proveedor.id_proveedor 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {proveedor.nombre}
                        </h4>
                        {proveedor.activo && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Activo
                          </span>
                        )}
                      </div>
                      
                      {proveedor.cuit && (
                        <p className="text-sm text-gray-600 mb-1">
                          CUIT: {proveedor.cuit}
                        </p>
                      )}
                      
                      <div className="space-y-1">
                        {proveedor.email && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{proveedor.email}</span>
                          </div>
                        )}
                        
                        {proveedor.telefono && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{proveedor.telefono}</span>
                          </div>
                        )}
                        
                        {proveedor.direccion && (
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{proveedor.direccion}</span>
                          </div>
                        )}
                      </div>
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