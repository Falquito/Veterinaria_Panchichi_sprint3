// client/src/components/comprobantes/DetalleRemitoModal.tsx
import React, { useState, useEffect } from 'react';
import { comprobantesService, type DetalleRemito } from '../../services/comprobantesService';
import { Loader, AlertCircle, X, FileText, User, Hash, Calendar, Package, Truck } from 'lucide-react';

interface Props {
  remitoId: number;
  onClose: () => void;
}

const InfoItem: React.FC<{icon: React.ReactNode, label: string, value: string | number, className?: string}> = ({ icon, label, value, className }) => (
    <div className={className}>
        <label className="text-xs text-gray-500 flex items-center gap-1">{icon} {label}</label>
        <p className="font-medium text-gray-800">{value}</p>
    </div>
);

function DetalleRemitoModal({ remitoId, onClose }: Props) {
  const [remito, setRemito] = useState<DetalleRemito | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!remitoId) return;
    const fetchDetalle = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await comprobantesService.getRemitoById(remitoId);
        setRemito(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el detalle del remito.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetalle();
  }, [remitoId]);

  return (
    <div className="w-full max-w-3xl bg-white rounded-lg">
      <div className="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-lg">
        <h2 className="text-xl font-semibold flex items-center gap-2"><FileText /> Detalle de Remito</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full"><X size={24} /></button>
      </div>
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {loading && <div className="text-center py-10"><Loader className="animate-spin inline-block h-8 w-8 text-blue-600" /></div>}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
        
        {/* --- CORRECCIÓN AQUÍ: Se agregaron optional chaining (?.) para evitar errores si los datos anidados no han cargado --- */}
        {remito && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border">
                <InfoItem icon={<User size={16} />} label="Proveedor" value={remito.proveedor?.nombre || 'N/A'} />
                <InfoItem icon={<Hash size={16} />} label="CUIT" value={remito.proveedor?.cuit || 'N/A'} />
                <InfoItem icon={<FileText size={16} />} label="N° Remito" value={remito.numero_remito || 'N/A'} />
                <InfoItem icon={<Calendar size={16} />} label="Fecha Emisión" value={remito.fecha ? new Date(remito.fecha).toLocaleDateString('es-AR') : 'N/A'} />
                <InfoItem icon={<Truck size={16} />} label="Dirección de Entrega" value={remito.direccion_entrega || 'N/A'} className="col-span-1 md:col-span-2" />
                <InfoItem icon={<Hash size={16} />} label="Orden de Compra Ref." value={`#${remito.ordenDeCompra?.id_oc || 'N/A'}`} />
            </div>
            <div>
              <h3 className="text-md font-semibold mb-2">Productos Entregados</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">Producto</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Cantidad</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Unidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                  {remito.detalles?.map((d, index) => (
                    <tr key={d.producto?.id || index}>
                      <td className="px-4 py-2">{d.producto?.nombre || 'Producto no encontrado'}</td>
                      <td className="px-4 py-2">{d.cantidad}</td>
                      <td className="px-4 py-2">{d.unidad_medida}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
       <div className="p-4 bg-gray-50 flex justify-end border-t rounded-b-lg">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cerrar</button>
        </div>
    </div>
  );
};

export default DetalleRemitoModal;