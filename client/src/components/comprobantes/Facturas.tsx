// client/src/components/comprobantes/Facturas.tsx
import React, { useState, useEffect } from 'react';
import { comprobantesService, type Factura } from '../../services/comprobantesService';
import { AlertCircle, Receipt, Plus, Eye, Loader } from 'lucide-react';
import { useModal } from '../ui/animated-modal';

interface FacturasProps {
  refreshKey: number;
  onCrear: () => void;
  onVerDetalle: (id: number) => void;
}

export const Facturas: React.FC<FacturasProps> = ({ refreshKey, onCrear, onVerDetalle }) => {
    const [facturas, setFacturas] = useState<Factura[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const { setOpen } = useModal();

    useEffect(() => {
        const fetchFacturas = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await comprobantesService.getFacturas();
                setFacturas(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'No se pudieron cargar las facturas.');
            } finally {
                setLoading(false);
            }
        };
        fetchFacturas();
    }, [refreshKey]);
    const handleVerDetalle = (id: number) => {
        onVerDetalle(id);
        setOpen(true);
    };

    const handleEstadoChange = async (id: number, nuevoEstado: string) => {
        setUpdatingId(id);
        try {
            await comprobantesService.updateFacturaEstado(id, nuevoEstado);
            setFacturas((prevFacturas) =>
                prevFacturas.map((factura) =>
                    factura.id === id ? { ...factura, estado: nuevoEstado } : factura
                )
            );
        } catch (err) {
            setError('No se pudo actualizar el estado de la factura.');
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando facturas...</p>
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
        <>
            <div className="mb-4 flex justify-end">
                <button
                onClick={onCrear}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                <Plus className="w-4 h-4" />
                Crear Factura
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Factura</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {facturas.length > 0 ? (
                        facturas.map((factura) => (
                            <tr key={factura.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{factura.numero}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{factura.proveedor?.nombre || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(factura.fecha).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${factura.total.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${factura.estado === 'PAGADO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {factura.estado}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                                {updatingId === factura.id ? <Loader className="animate-spin" /> :
                                    <select 
                                        value={factura.estado} 
                                        onChange={(e) => handleEstadoChange(factura.id, e.target.value)}
                                        className="text-xs border-gray-300 rounded-md"
                                    >
                                        <option>PENDIENTE</option>
                                        <option>PAGADO</option>
                                        <option>ANULADO</option>
                                    </select>
                                }
                            </td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => handleVerDetalle(factura.id)}
                                        className="text-blue-600 hover:text-blue-800 text-xs font-bold"
                                    >
                                    <Eye className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                <Receipt className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron facturas</h3>
                                <p className="mt-1 text-sm text-gray-500">Aún no se ha cargado ninguna factura.</p>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </>
    );
};