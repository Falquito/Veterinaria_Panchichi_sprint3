import React, { useState } from 'react';
import { FileText, Receipt, Plus } from 'lucide-react';
import { useComprobantes } from '../hooks/useComprobantes';
import { FacturasTable, RemitosTable } from '../components/TableComponents';
import { ComprobanteModal } from '../components/FacturaModal'; // Usando el modal unificado
import type { TabType } from '../types/comprobantes';

const Comprobantes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('remitos');
  const [showComprobanteModal, setShowComprobanteModal] = useState(false);

  // Hook personalizado para manejar datos
  const { facturas, remitos, loading, error, refreshData } = useComprobantes();

  // Handler para éxito en modal unificado
  const handleComprobanteSuccess = () => {
    refreshData();
    setShowComprobanteModal(false);
  };

  // Renderizar contenido según tab activo
  const renderTabContent = () => {
    if (activeTab === 'facturas') {
      return <FacturasTable facturas={facturas} loading={loading} />;
    }
    
    return <RemitosTable remitos={remitos} loading={loading} />;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Comprobantes</h1>
              <p className="text-gray-600">Gestiona tus remitos y facturas.</p>
            </div>
             {/* Botón unificado */}
          <button
            onClick={() => setShowComprobanteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Comprobante
          </button>
          </div>
        </div>
       

        {/* Error global */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            Error: {error}
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('remitos')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                activeTab === 'remitos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="mr-2 h-5 w-5" />
              Remitos ({remitos.length})
            </button>
            <button
              onClick={() => setActiveTab('facturas')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                activeTab === 'facturas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Receipt className="mr-2 h-5 w-5" />
              Facturas ({facturas.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {renderTabContent()}
        </div>
      </div>

      {/* Modal Unificado */}
      <ComprobanteModal
        open={showComprobanteModal}
        onClose={() => setShowComprobanteModal(false)}
        onSuccess={handleComprobanteSuccess}
      />
    </div>
  );
};

export default Comprobantes;