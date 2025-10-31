import React, { useState } from 'react';
import { Eye, Calendar, User, Building2, TrendingUp, Download, Filter, FileText, Package, Hash, CreditCard } from 'lucide-react';
import type { Factura, Remito } from '../types/comprobantes';
import { ComprobanteDetalleModal } from './ComprobanteDetalle';

interface FacturasTableProps {
  facturas: Factura[];
  loading?: boolean;
}

interface RemitosTableProps {
  remitos: Remito[];
  loading?: boolean;
}

export const FacturasTable: React.FC<FacturasTableProps> = ({ facturas, loading }) => {
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewDetail = (factura: Factura) => {
    setSelectedFactura(factura);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFactura(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="animate-pulse p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="flex space-x-2">
              <div className="h-9 bg-gray-200 rounded w-20"></div>
              <div className="h-9 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-7 gap-4">
                {[...Array(7)].map((_, j) => (
                  <div key={j} className="h-14 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case 'factura':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
      case 'nota de credito':
        return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
      case 'nota de debito':
        return 'bg-orange-50 text-orange-700 ring-1 ring-orange-600/20';
      default:
        return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Facturas</h3>
                <p className="text-sm text-gray-500">
                  {facturas.length} {facturas.length === 1 ? 'factura registrada' : 'facturas registradas'}
                </p>
              </div>
            </div>
            
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <Hash className="w-4 h-4" />
                    <span>Número</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Fecha</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>Proveedor</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <CreditCard className="w-4 h-4" />
                    <span>Tipo</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-4 h-4" />
                    <span>Depósito</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Total</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Detalle
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {facturas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">No hay facturas</h3>
                        <p className="text-gray-500 mt-1">Comienza creando tu primera factura</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                facturas.map((factura) => (
                  <tr key={factura.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          #{factura.numero || 'Sin número'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {factura.fecha ? new Date(factura.fecha).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        }) : 'Sin fecha'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {factura.proveedor?.nombre || 'Sin nombre'}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {factura.proveedor?.id_proveedor || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(factura.tipoDeComprobante?.tipo)}`}>
                        {factura.tipoDeComprobante?.tipo || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {factura.deposito?.nombre || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${factura.total?.toLocaleString('es-AR', { minimumFractionDigits: 2 }) || '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button 
                        onClick={() => handleViewDetail(factura)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium"
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
      </div>

      {/* Modal de detalle */}
      <ComprobanteDetalleModal
        open={modalOpen}
        onClose={handleCloseModal}
        comprobante={selectedFactura}
        tipo="factura"
      />
    </>
  );
};

export const RemitosTable: React.FC<RemitosTableProps> = ({ remitos, loading }) => {
  const [selectedRemito, setSelectedRemito] = useState<Remito | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewDetail = (remito: Remito) => {
    setSelectedRemito(remito);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRemito(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="animate-pulse p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="flex space-x-2">
              <div className="h-9 bg-gray-200 rounded w-20"></div>
              <div className="h-9 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-14 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getEstadoColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'entregado':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
      case 'disponible':
        return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
      case 'pendiente':
        return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
      case 'cancelado':
        return 'bg-red-50 text-red-700 ring-1 ring-red-600/20';
      default:
        return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Remitos</h3>
                <p className="text-sm text-gray-500">
                  {remitos.length} {remitos.length === 1 ? 'remito registrado' : 'remitos registrados'}
                </p>
              </div>
            </div>
            
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <Hash className="w-4 h-4" />
                    <span>ID Remito</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Fecha</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>Proveedor</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Detalle
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {remitos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">No hay remitos</h3>
                        <p className="text-gray-500 mt-1">Comienza creando tu primer remito</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                remitos.map((remito) => (
                  <tr key={remito.id_remito} className="hover:bg-gray-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          #{remito.id_remito || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {remito.fecha ? new Date(remito.fecha).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        }) : 'Sin fecha'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {remito.proveedor?.nombre || 'Sin nombre'}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {remito.proveedor?.id_proveedor || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getEstadoColor(remito.estado)}`}>
                        {remito.estado || 'Sin estado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewDetail(remito)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium"
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
      </div>

      {/* Modal de detalle */}
      <ComprobanteDetalleModal
        open={modalOpen}
        onClose={handleCloseModal}
        comprobante={selectedRemito}
        tipo="remito"
      />
    </>
  );
};