// client/src/components/comprobantes/DetalleFacturaModal.tsx
import React, { useState, useEffect } from 'react';
import { comprobantesService, type DetalleFactura } from '../../services/comprobantesService';
import { Loader, AlertCircle, X, Receipt, User, Hash, Calendar, FileText } from 'lucide-react';

interface Props {
  facturaId: number;
  onClose: () => void;
}

function DetalleFacturaModal({ facturaId, onClose }: Props) {
  const [factura, setFactura] = useState<DetalleFactura | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!facturaId) return;
    const fetchDetalle = async () => {
      setLoading(true);
      try {
        const data = await comprobantesService.getFacturaById(facturaId);
        setFactura(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el detalle de la factura.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetalle();
  }, [facturaId]);

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg">
      <div className="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-lg">
        <h2 className="text-xl font-semibold flex items-center gap-2"><Receipt /> Detalle de Factura</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full"><X size={24} /></button>
      </div>
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {loading && <div className="text-center py-10"><Loader className="animate-spin inline-block h-8 w-8 text-blue-600" /></div>}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
        {factura && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border">
                <InfoItem icon={<User size={16} />} label="Proveedor" value={factura.proveedor?.nombre || 'N/A'} />
                <InfoItem icon={<Hash size={16} />} label="CUIT" value={factura.proveedor?.cuit || 'N/A'} />
                <InfoItem icon={<Receipt size={16} />} label="N° Factura" value={`${factura.tipo || ''} - ${factura.numero}`} />
                <InfoItem icon={<Calendar size={16} />} label="Fecha Emisión" value={new Date(factura.fecha).toLocaleDateString('es-AR')} />
                <InfoItem icon={<FileText size={16} />} label="Remito Asociado" value={`#${factura.remito?.numero_remito || factura.remito?.id_remito || 'N/A'}`} />
                 <InfoItem icon={<Hash size={16} />} label="Estado" value={factura.estado} />
            </div>
            <div>
              <h3 className="text-md font-semibold mb-2">Detalle de Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">Producto</th>
                      <th className="px-4 py-2 text-right text-sm font-medium">Cant.</th>
                      <th className="px-4 py-2 text-right text-sm font-medium">P. Unit.</th>
                      <th className="px-4 py-2 text-right text-sm font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                  {factura.detalles.map(d => (
                    <tr key={d.id}>
                      <td className="px-4 py-2">{d.producto?.nombre || 'Producto no encontrado'}</td>
                      <td className="px-4 py-2 text-right">{d.cantidad}</td>
                      <td className="px-4 py-2 text-right">${d.precio_unitario_compra.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right font-medium">${d.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 bg-gray-50 rounded-lg border">
                    <h3 className="text-md font-semibold">Impuestos y Totales</h3>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Neto Gravado:</span> <span>${factura.total_neto.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">IVA:</span> <span>${factura.iva.toFixed(2)}</span></div>
                </div>
                 <div className="text-right bg-blue-50 p-4 rounded-lg border-blue-200 border">
                    <label className="text-sm text-blue-800">TOTAL A PAGAR</label>
                    <p className="font-bold text-3xl text-blue-900">${factura.total.toFixed(2)}</p>
                </div>
            </div>
            {factura.observaciones && <InfoItem label="Observaciones" value={factura.observaciones} className="col-span-2" />}
          </div>
        )}
      </div>
       <div className="p-4 bg-gray-50 flex justify-end border-t rounded-b-lg">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cerrar</button>
        </div>
    </div>
  );
};

const InfoItem: React.FC<{icon?: React.ReactNode, label: string, value: string | number, className?: string}> = ({ icon, label, value, className }) => (
    <div className={className}>
        <label className="text-xs text-gray-500 flex items-center gap-1">{icon} {label}</label>
        <p className="font-medium text-gray-800">{value}</p>
    </div>
);

export default DetalleFacturaModal;