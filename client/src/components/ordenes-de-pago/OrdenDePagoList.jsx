import React, { useState, useEffect, useCallback } from 'react';
import { FileText, AlertCircle, DollarSign, Clock, CheckCircle, XCircle, Plus, Eye, Search, Calendar } from 'lucide-react';

import CrearOrdenDePago from "../ordenes-de-pago/CrearOrdenDePago";
import OrdenDetalleModal from "../ordenes-de-pago/OrdenDetalleModal";

const OrdenDePagoList = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [showCrear, setShowCrear] = useState(false);
  const [showDetalle, setShowDetalle] = useState(false);
  const [selectedOrdenId, setSelectedOrdenId] = useState(null);

  const loadOrdenes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // ⬅️ puerto correcto
      const response = await fetch('http://localhost:3000/orden-de-pago');
      if (!response.ok) throw new Error('Error al obtener las órdenes de pago');
      const data = await response.json();
      setOrdenes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar las órdenes de pago');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrdenes();
  }, [loadOrdenes]);

  const ordenesFiltradas = ordenes.filter((orden) => {
    const matchesSearch =
      orden.id?.toString().includes(searchTerm) ||
      (orden.proveedor?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (orden.proveedor?.cuit || '').includes(searchTerm);

    const matchesEstado = !filtroEstado || orden.estado === filtroEstado;
    return matchesSearch && matchesEstado;
  });

  const formatFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleDateString('es-AR');
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Pagado':    return 'bg-green-100 text-green-800 border-green-200';
      case 'Anulado':   return 'bg-red-100 text-red-800 border-red-200';
      default:          return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Pendiente': return <Clock className="w-4 h-4" />;
      case 'Pagado':    return <CheckCircle className="w-4 h-4" />;
      case 'Anulado':   return <XCircle className="w-4 h-4" />;
      default:          return <FileText className="w-4 h-4" />;
    }
  };

  const stats = {
    total: ordenes.length,
    pendientes: ordenes.filter(o => o.estado === 'Pendiente').length,
    pagadas: ordenes.filter(o => o.estado === 'Pagado').length,
    montoTotal: ordenes.reduce((sum, o) => sum + (parseFloat(o.montoTotal) || 0), 0),
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br ">
      <div className="max-w-13xl mx-auto">
        {/* Header */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Órdenes de Pago</h1>
              <p className="text-gray-600">Gestiona las órdenes de pago a proveedores</p>
            </div>
            <button
              onClick={() => setShowCrear(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Nueva Orden
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Órdenes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendientes}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pagadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.pagadas}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monto Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.montoTotal.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-gray-900">Filtros y Búsqueda</h3>
              <p className="text-sm text-gray-600">
                {ordenesFiltradas.length} de {ordenes.length} órdenes
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por ID, proveedor o CUIT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Pagado">Pagado</option>
              <option value="Anulado">Anulado</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando órdenes...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forma de Pago</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comprobantes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ordenesFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                        {ordenes.length === 0 ? "No hay órdenes de pago" : "No se encontraron órdenes con los filtros aplicados"}
                      </td>
                    </tr>
                  ) : (
                    ordenesFiltradas.map((orden) => (
                      <tr key={orden.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">#{orden.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatFecha(orden.fecha)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{orden.proveedor?.nombre || 'Sin proveedor'}</div>
                            <div className="text-gray-500">{orden.proveedor?.cuit || ''}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {orden.formaDePago}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-green-600">
                            ${parseFloat(orden.montoTotal || 0).toFixed(2)}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                            {orden.detalles?.length || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => { setSelectedOrdenId(orden.id); setShowDetalle(true); }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modales reales */}
      {showCrear && (
        <CrearOrdenDePago
          onClose={() => setShowCrear(false)}
          onSuccess={() => {
            setShowCrear(false);
            loadOrdenes(); // refresca la lista
          }}
        />
      )}

      {showDetalle && selectedOrdenId && (
        <OrdenDetalleModal
          ordenId={selectedOrdenId}
          onClose={() => {
            setShowDetalle(false);
            setSelectedOrdenId(null);
          }}
        />
      )}
    </div>
  );
};

export default OrdenDePagoList;
