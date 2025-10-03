// client/src/components/comprobantes/CrearRemitoModal.tsx
import React, { useState, useEffect } from 'react';
import { comprobantesService, type OrdenDeCompra } from '../../services/comprobantesService';
import { Loader, AlertCircle, X, FilePlus, ShoppingCart } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

// Usamos la sintaxis de función para una mejor inferencia de tipos
function CrearRemitoModal({ onClose, onSuccess }: Props) {
  const [ordenesDisponibles, setOrdenesDisponibles] = useState<OrdenDeCompra[]>([]);
  const [selectedOCId, setSelectedOCId] = useState<string>('');
  const [numeroRemito, setNumeroRemito] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedOC = ordenesDisponibles.find(oc => oc.id_oc === Number(selectedOCId));

  useEffect(() => {
    const fetchOCs = async () => {
      setLoading(true);
      try {
        const data = await comprobantesService.getAvailableOCs();
        setOrdenesDisponibles(data);
        if (data.length > 0) {
          setSelectedOCId(String(data[0].id_oc));
        }
      } catch (err) {
        setError('Error al cargar órdenes de compra disponibles.');
      } finally {
        setLoading(false);
      }
    };
    fetchOCs();
  }, []);

  const handleSubmit = async () => {
    if (!selectedOCId || !numeroRemito || !fecha) {
      setError("La Orden de Compra, el número de remito y la fecha son obligatorios.");
      return;
    }
    setLoading(true);
    setError(null);

    const orden = ordenesDisponibles.find(oc => oc.id_oc === Number(selectedOCId));
    if (!orden) return;
    
    const remitoData = {
      numero_remito: numeroRemito,
      fecha,
      id_proveedor: orden.proveedor.id_proveedor,
      id_oc: orden.id_oc,
      productos: orden.productos.map(p => ({
        id_producto: p.producto.id,
        cantidad: p.cantidad,
        unidad_medida: 'unidades' 
      })),
      direccion_entrega: orden.proveedor.direccion || 'No especificada',
    };

    try {
      await comprobantesService.createRemito(remitoData);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el remito.');
      setLoading(false);
    }
  };

  return (
     <div className="w-full max-w-2xl bg-white rounded-lg">
        <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2"><FilePlus /> Crear Nuevo Remito</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-md flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
            <div>
                <label className="block text-sm font-medium text-gray-700">1. Seleccionar Orden de Compra a Asociar</label>
                <select 
                    value={selectedOCId} 
                    onChange={e => setSelectedOCId(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    disabled={loading || ordenesDisponibles.length === 0}
                >
                    {ordenesDisponibles.length > 0 ? (
                        ordenesDisponibles.map(oc => <option key={oc.id_oc} value={oc.id_oc}>OC #{oc.id_oc} - {oc.proveedor.nombre}</option>)
                    ) : (
                        <option>No hay órdenes de compra disponibles</option>
                    )}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">2. Ingrese el Número de Remito (del papel)</label>
                <input 
                    type="text" 
                    value={numeroRemito}
                    onChange={e => setNumeroRemito(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">3. Fecha de Emisión</label>
                <input 
                    type="date"
                    value={fecha}
                    onChange={e => setFecha(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            {selectedOC && (
                <div className="bg-gray-50 p-4 rounded-md border">
                    <h3 className="font-semibold mb-2">Productos en la Orden de Compra</h3>
                    <ul className="space-y-1 text-sm">
                        {selectedOC.productos.map(item => (
                            <li key={item.producto.id} className="flex justify-between">
                                <span>{item.producto.nombre}</span>
                                <span className="font-medium">x {item.cantidad}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t rounded-b-lg">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
            <button onClick={handleSubmit} disabled={loading || !selectedOCId} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2">
                {loading ? <Loader className="animate-spin" size={20}/> : 'Guardar Remito'}
            </button>
        </div>
    </div>
  );
};

export default CrearRemitoModal;