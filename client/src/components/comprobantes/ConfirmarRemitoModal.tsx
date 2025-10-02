import React, { useState, useEffect } from 'react';
import type { Remito } from '../../services/comprobantesService';
import { depositosService, type Deposito } from '../../services/depositosService';
import { comprobantesService } from '../../services/comprobantesService';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  remito: Remito | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ConfirmarRemitoModal: React.FC<Props> = ({ isOpen, remito, onClose, onSuccess }) => {
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const [selectedDeposito, setSelectedDeposito] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      depositosService.getAll().then(data => {
        setDepositos(data);
        if (data.length > 0) {
          setSelectedDeposito(String(data[0].id_deposito));
        }
      });
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!remito || !selectedDeposito) return;
    setLoading(true);
    try {
      await comprobantesService.confirmarRemito(remito.id_remito, Number(selectedDeposito));
      onSuccess();
    } catch (error) {
      alert(`Error al confirmar: ${error}`);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen || !remito) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Confirmar Recepción de Remito #{remito.id_remito}</h3>
          <button onClick={onClose}><X size={20}/></button>
        </div>
        <div className="p-6 space-y-4">
            <p>Se actualizará el stock de los productos correspondientes a este remito.</p>
            <div>
                <label htmlFor="deposito" className="block text-sm font-medium text-gray-700">
                    Seleccionar depósito de destino:
                </label>
                <select 
                    id="deposito"
                    value={selectedDeposito}
                    onChange={(e) => setSelectedDeposito(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                    {depositos.map(d => <option key={d.id_deposito} value={d.id_deposito}>{d.nombre}</option>)}
                </select>
            </div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
            <button onClick={handleConfirm} disabled={loading || !selectedDeposito} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                {loading ? 'Confirmando...' : 'Confirmar'}
            </button>
        </div>
      </div>
    </div>
  );
};