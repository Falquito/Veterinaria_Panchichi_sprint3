import React, { useState, useEffect } from 'react';
import { comprobantesService, type Remito } from '../../services/comprobantesService';
import { AlertCircle, FileText } from 'lucide-react';

export const Remitos = () => {
  const [remitos, setRemitos] = useState<Remito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRemitos = async () => {
      try {
        const data = await comprobantesService.getRemitos();
        setRemitos(data);
      } catch (err) {
        setError('No se pudieron cargar los remitos.');
      } finally {
        setLoading(false);
      }
    };
    fetchRemitos();
  }, []);

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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
        </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Remito</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden de Compra</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {remitos.length > 0 ? (
                    remitos.map((remito) => (
                        <tr key={remito.id_remito}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{remito.id_remito}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{remito.proveedor?.nombre || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(remito.fecha).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                                {remito.ordenDeCompra ? (
                                    <a href={`/orden-de-compra/${remito.ordenDeCompra.id_oc}`} className="hover:underline">
                                        #{remito.ordenDeCompra.id_oc}
                                    </a>
                                ) : 'N/A'}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron remitos</h3>
                            <p className="mt-1 text-sm text-gray-500">Aún no se ha generado ningún remito.</p>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
  );
};