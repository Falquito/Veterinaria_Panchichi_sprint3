import React, { useState, useEffect } from 'react';
import { comprobantesService, type Remito } from '../../services/comprobantesService';
import { AlertCircle, FileText } from 'lucide-react';
import { ConfirmarRemitoModal } from './ConfirmarRemitoModal';

// Función mejorada para formatear fechas
const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    
    // Intenta con el constructor de Date, que maneja bien 'YYYY-MM-DD'
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
        const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        return utcDate.toLocaleDateString('es-AR', { timeZone: 'UTC' });
    }

    // Intenta parsear formatos como DD-MM-YY o DD-MM-YYYY
    const parts = dateString.split(/[-/]/);
    if (parts.length === 3) {
        const [day, month, year] = parts;
        const fullYear = year.length === 2 ? `20${year}` : year;
        const parsedDate = new Date(`${fullYear}-${month}-${day}`);
        if (!isNaN(parsedDate.getTime())) {
            return new Date(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate())
                   .toLocaleDateString('es-AR', { timeZone: 'UTC' });
        }
    }

    return 'Fecha inválida';
};


export const Remitos = () => {
  const [remitos, setRemitos] = useState<Remito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remitoSeleccionado, setRemitoSeleccionado] = useState<Remito | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRemitos = async () => {
    try {
      setLoading(true);
      const data = await comprobantesService.getRemitos();
      setRemitos(data);
    } catch (err) {
      setError('No se pudieron cargar los remitos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemitos();
  }, []);

  const handleConfirmClick = (remito: Remito) => {
    setRemitoSeleccionado(remito);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchRemitos(); // Refresca la lista
  };
  
  if (loading) {
    return (
        <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando remitos...</p>
        </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {remitos.length > 0 ? (
              remitos.map((remito) => (
                <tr key={remito.id_remito}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{remito.id_remito}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{remito.proveedor?.nombre || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(remito.fecha)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      remito.estado === 'Recibido' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {remito.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {remito.estado === 'Pendiente' && (
                      <button 
                        onClick={() => handleConfirmClick(remito)}
                        className="bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded-md hover:bg-blue-700"
                      >
                        Confirmar Recepción
                      </button>
                    )}
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
      <ConfirmarRemitoModal 
        isOpen={isModalOpen}
        remito={remitoSeleccionado}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};