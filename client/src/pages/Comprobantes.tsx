import React, { useState } from 'react';
import { Remitos, Facturas } from '../components/comprobantes/';
import { FileText, Receipt } from 'lucide-react';

const Comprobantes = () => {
  const [activeTab, setActiveTab] = useState('remitos');

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Comprobantes</h1>
          <p className="text-gray-600 mt-1">Gestiona tus remitos y facturas.</p>
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
          {activeTab === 'facturas' && <Facturas />}
        </div>
      </div>
    </div>
  );
};

export default Comprobantes;