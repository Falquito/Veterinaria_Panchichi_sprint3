import React, { useState, useEffect } from 'react';
import { comprobantesService, type Factura } from '../../services/comprobantesService';
import { AlertCircle, Receipt } from 'lucide-react';

export const Facturas = () => {
    const [facturas, setFacturas] = useState<Factura[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFacturas = async () => {
            try {
                const data = await comprobantesService.getFacturas();
                setFacturas(data);
            } catch (err) {
                setError('No se pudieron cargar las facturas.');
            } finally {
                setLoading(false);
            }
        };
        fetchFacturas();
    }, []);

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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Factura</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {facturas.length > 0 ? (
                    facturas.map((factura) => (
                        <tr key={factura.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{factura.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{factura.numero}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{factura.proveedor?.nombre || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(factura.fecha).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${factura.total.toFixed(2)}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            <Receipt className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron facturas</h3>
                            <p className="mt-1 text-sm text-gray-500">Aún no se ha cargado ninguna factura.</p>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};