// client/src/pages/Comprobantes.tsx
import React, { useState, useCallback } from 'react';
import { Remitos, Facturas } from '../components/comprobantes/';
import { FileText, Receipt } from 'lucide-react';
import { useModal, ModalBody, ModalContent } from "../components/ui/animated-modal";
import CrearRemitoModal from '../components/comprobantes/CrearRemitoModal';
import CrearFacturaModal from '../components/comprobantes/CrearFacturaModal';
import DetalleRemitoModal from '../components/comprobantes/DetalleRemitoModal';
import DetalleFacturaModal from '../components/comprobantes/DetalleFacturaModal';

type ModalType = 'crearRemito' | 'crearFactura' | 'verRemito' | 'verFactura' | null;

const Comprobantes = () => {
  const [activeTab, setActiveTab] = useState('remitos');
  const [refreshKey, setRefreshKey] = useState(0);
  const { setOpen } = useModal();

  // Un solo estado para controlar el contenido del modal
  const [modalContent, setModalContent] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSuccess = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    setOpen(false);
    setModalContent(null);
  }, [setOpen]);
  
  const handleClose = useCallback(() => {
      setOpen(false);
      setModalContent(null);
      setSelectedId(null);
  }, [setOpen]);

  // Funciones para abrir cada modal
  const openCrearRemito = () => { setModalContent('crearRemito'); setOpen(true); };
  const openCrearFactura = () => { setModalContent('crearFactura'); setOpen(true); };
  const openVerRemito = (id: number) => { setSelectedId(id); setModalContent('verRemito'); setOpen(true); };
  const openVerFactura = (id: number) => { setSelectedId(id); setModalContent('verFactura'); setOpen(true); };

  const renderModalContent = () => {
      if (!modalContent) return null;

      switch(modalContent) {
          case 'crearRemito':
              return <CrearRemitoModal onClose={handleClose} onSuccess={handleSuccess} />;
          case 'crearFactura':
              return <CrearFacturaModal onClose={handleClose} onSuccess={handleSuccess} />;
          case 'verRemito':
              return selectedId ? <DetalleRemitoModal remitoId={selectedId} onClose={handleClose} /> : null;
          case 'verFactura':
              return selectedId ? <DetalleFacturaModal facturaId={selectedId} onClose={handleClose} /> : null;
          default:
              return null;
      }
  }

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Comprobantes</h1>
            <p className="text-gray-600 mt-1">Gestiona tus remitos y facturas de compra.</p>
          </div>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('remitos')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                  ${activeTab === 'remitos' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FileText className="mr-2 h-5 w-5" />
                Remitos
              </button>
              <button
                onClick={() => setActiveTab('facturas')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                  ${activeTab === 'facturas' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <Receipt className="mr-2 h-5 w-5" />
                Facturas
              </button>
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === 'remitos' && (
              <Remitos
                refreshKey={refreshKey}
                onCrear={openCrearRemito}
                onVerDetalle={openVerRemito}
              />
            )}
            {activeTab === 'facturas' && (
              <Facturas
                refreshKey={refreshKey}
                onCrear={openCrearFactura}
                onVerDetalle={openVerFactura}
              />
            )}
          </div>
        </div>
      </div>

      <ModalBody>
        <ModalContent>
          {renderModalContent()}
        </ModalContent>
      </ModalBody>
    </>
  );
};

export default Comprobantes;