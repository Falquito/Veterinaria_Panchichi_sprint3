// client/src/components/comprobantes/Remitos.tsx
import React, { useState, useEffect } from 'react';
import { comprobantesService, type Remito } from '../../services/comprobantesService';
import { AlertCircle, FileText, Plus, Eye, Loader } from 'lucide-react';
import { useModal } from '../ui/animated-modal';

// Interfaz para definir las props que el componente recibe
interface RemitosProps {
  refreshKey: number;
  onCrear: () => void;
  onVerDetalle: (id: number) => void;
}

const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    // Aseguramos que se interprete como UTC para evitar problemas de zona horaria
    const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    return utcDate.toLocaleDateString('es-AR', { timeZone: 'UTC' });
};

export const Remitos: React.FC<RemitosProps> = ({ refreshKey, onCrear, onVerDetalle }) => {
  const [remitos, setRemitos] = useState<Remito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setOpen } = useModal();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchRemitos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await comprobantesService.getRemitos();
      setRemitos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los remitos.');
    } finally {
      setLoading(false);
    }
  };
  const handleEstadoChange = async (id: number, nuevoEstado: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres cambiar el estado a "${nuevoEstado}"?`)) {
      return;
    }
    setUpdatingId(id);
    try {
        await comprobantesService.updateRemitoEstado(id, nuevoEstado);
        fetchRemitos(); // Refresca la lista para mostrar el cambio
    } catch (error) {
        alert(`Error al actualizar el estado: ${error}`);
    } finally {
        setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchRemitos();
  }, [refreshKey]);

  const handleVerDetalle = (id: number) => {
    onVerDetalle(id);
    setOpen(true);
  };
  
  if (loading) {
    return (
        <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando remitos...</p>
        </div>
    );
  }
  
   if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
        <AlertCircle size={16}/> {error}
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          onClick={onCrear}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" />
          Crear Remito
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Remito</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {remitos.length > 0 ? (
              remitos.map((remito) => (
                <tr key={remito.id_remito} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{remito.numero_remito || remito.id_remito}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{remito.proveedor?.nombre || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(remito.fecha)}</td>
                  <td className="px-6 py-4 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${remito.estado === 'Recibido' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {remito.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                    {updatingId === remito.id_remito ? <Loader className="animate-spin" /> :
                        <select 
                            value={remito.estado} 
                            onChange={(e) => handleEstadoChange(remito.id_remito, e.target.value)}
                            className="text-xs border-gray-300 rounded-md"
                        >
                            <option>Pendiente</option>
                            <option>Recibido</option>
                            <option>Cancelado</option>
                        </select>
                    }
                </td>
                  <td className="px-6 py-4 text-center">
                     <button 
                        onClick={() => handleVerDetalle(remito.id_remito)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-bold"
                      >
                       <Eye className="h-5 w-5" />
                      </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron remitos</h3>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};