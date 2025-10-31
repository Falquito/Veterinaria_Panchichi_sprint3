import React, { useState, useEffect } from 'react';
import { Search, Warehouse, X, MapPin } from 'lucide-react';
import { listDepots } from '../services/depotService';
import type { Depot } from '../types/depot';

interface DepositoSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (deposito: Depot) => void;
  selectedDepositoId?: number;
}

export const DepositoSelector: React.FC<DepositoSelectorProps> = ({
  open,
  onClose,
  onSelect,
  selectedDepositoId
}) => {
  const [depositos, setDepositos] = useState<Depot[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDepositos, setFilteredDepositos] = useState<Depot[]>([]);

  useEffect(() => {
    if (open) {
      loadDepositos();
    }
  }, [open]);

  useEffect(() => {
    const filtered = depositos.filter(deposito =>
      deposito.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposito.direccion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDepositos(filtered);
  }, [searchTerm, depositos]);

  const loadDepositos = async () => {
    setLoading(true);
    try {
      const depositosData = await listDepots();
      // Solo mostrar depósitos activos
      setDepositos(depositosData.filter(d => d.activo !== false));
    } catch (error) {
      console.error('Error loading depositos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (deposito: Depot) => {
    onSelect(deposito);
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-purple-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Warehouse className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Seleccionar Depósito</h3>
              <p className="text-sm text-gray-500">
                {filteredDepositos.length} depósitos disponibles
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
              placeholder="Buscar por nombre o dirección..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          ) : filteredDepositos.length === 0 ? (
            <div className="text-center py-12">
              <Warehouse className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No se encontraron depósitos' : 'No hay depósitos disponibles'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDepositos.map((deposito) => (
                <div
                  key={deposito.id_deposito}
                  onClick={() => handleSelect(deposito)}
                  className={`
                    border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
                    ${selectedDepositoId === deposito.id_deposito 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Warehouse className="w-6 h-6 text-purple-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {deposito.nombre}
                        </h4>
                        {deposito.activo !== false && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Activo
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-1">
                        ID: {deposito.id_deposito}
                      </p>
                      
                      {deposito.direccion && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{deposito.direccion}</span>
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