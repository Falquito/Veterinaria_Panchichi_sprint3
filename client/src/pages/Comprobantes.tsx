import React, { useState } from 'react';
import { Remitos, Facturas } from '../components/comprobantes/';
import { FileText, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal, ModalBody, ModalContent, ModalTrigger } from '@/components/ui/animated-modal';
import type { Product } from '@/types/product';
import { LabelInputContainer } from '@/components/signup-form-demo';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const Comprobantes = () => {
  const [activeTab, setActiveTab] = useState('remitos');
  const [productos,setProductos]=useState<Product[]>([])

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 bg-white p-10 rounded-2xl border border-emerald-500   flex">
          <div className=''>
            <h1 className="text-3xl font-bold text-gray-900">Comprobantes</h1>
            <p className="text-gray-600 mt-1">Gestiona tus remitos y facturas.</p>
          </div>
          <div className=' flex justify-end w-full items-center p-4'>
            <Modal>
              <ModalTrigger>
                <button className="border  transition bg-emerald-500 p-4 rounded-2xl text-3xl font-bold text-white hover:drop-shadow-xl hover:bg-white hover:text-emerald-500 hover:border-emerald-500">+ {activeTab[0].toUpperCase()+activeTab.split(activeTab[0])[1]}</button>
              </ModalTrigger>
              
              <ModalBody>
                <div className='flex flex-col p-4'>
                  <p className='text-2xl font-bold'>Crear {activeTab}</p>
                  <div className='flex flex-row'>
                    {activeTab.toLowerCase()==="facturas"?(
                      <>
                      <select defaultValue="Seleccione tipo de factura" className="select select-accent">
                        <option disabled={true}>Seleccione tipo de factura</option>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                      </select>
                      </>
                    ):
                    <>
                    </>}

                  </div>
                </div>
              </ModalBody>
              
            </Modal>
          </div>
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
          {activeTab === 'remitos' && <Remitos />}
          {activeTab === 'facturas' && (
            // Si tu componente Facturas no escucha reloadFlag, podemos envolverlo para forzar un remount con key
            
              <Facturas />
            
          )}
        </div>
      </div>

      {/* <NuevaFacturaModal
        open={showNuevaFactura}
        onClose={() => setShowNuevaFactura(false)}
        onSuccess={handleFacturaCreada}
      /> */}
    </div>
  );
};

export default Comprobantes;
