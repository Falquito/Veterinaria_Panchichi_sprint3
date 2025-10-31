import React, { useState } from 'react';
import { FileText, Receipt, Plus, TrendingUp, Search, Filter, Download } from 'lucide-react';
import { useComprobantes } from '../hooks/useComprobantes';
import { FacturasTable, RemitosTable } from '../components/TableComponents';
import { ComprobanteModal } from '../components/FacturaModal';
import type { TabType } from '../types/comprobantes';

const Comprobantes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('remitos');
  const [showComprobanteModal, setShowComprobanteModal] = useState(false);

  const { facturas, remitos, loading, error, refreshData } = useComprobantes();

  const handleComprobanteSuccess = () => {
    refreshData();
    setShowComprobanteModal(false);
  };

  const totalFacturas = facturas.reduce((sum, factura) => sum + (factura.total || 0), 0);

  const renderTabContent = () => {
    if (activeTab === 'facturas') {
      return <FacturasTable facturas={facturas} loading={loading} />;
    }
    
    return <RemitosTable remitos={remitos} loading={loading} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Comprobantes</h1>
                  <p className="text-gray-600 text-sm">Gestiona tus remitos y facturas</p>
                </div>
              </div>

              {/* Stats */}
              <div className="hidden md:flex items-center space-x-6 ml-8">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{facturas.length}</div>
                  <div className="text-xs text-gray-500">Facturas</div>
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{remitos.length}</div>
                  <div className="text-xs text-gray-500">Remitos</div>
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    ${totalFacturas.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowComprobanteModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Comprobante
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="font-medium">Error</div>
            <div className="text-sm">{error}</div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="px-6">
              <div className="flex items-center justify-between">
                
                {/* Tabs */}
                <div className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('remitos')}
                    className={`relative py-4 px-1 font-medium text-sm transition-colors ${
                      activeTab === 'remitos'
                        ? 'text-blue-600 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Remitos</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        activeTab === 'remitos'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {remitos.length}
                      </span>
                    </div>
                    
                    {/* Active indicator */}
                    {activeTab === 'remitos' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('facturas')}
                    className={`relative py-4 px-1 font-medium text-sm transition-colors ${
                      activeTab === 'facturas'
                        ? 'text-blue-600 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Receipt className="w-4 h-4" />
                      <span>Facturas</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        activeTab === 'facturas'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {facturas.length}
                      </span>
                    </div>
                    
                    {/* Active indicator */}
                    {activeTab === 'facturas' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                  </button>
                </div>

          
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Modal */}
      <ComprobanteModal
        open={showComprobanteModal}
        onClose={() => setShowComprobanteModal(false)}
        onSuccess={handleComprobanteSuccess}
      />
    </div>
  );
};

export default Comprobantes;