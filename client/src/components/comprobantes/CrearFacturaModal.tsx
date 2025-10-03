// client/src/components/comprobantes/CrearFacturaModal.tsx
import React, { useState, useEffect } from 'react';
import { comprobantesService, type Remito, type DetalleRemito } from '../../services/comprobantesService';
import { Loader, AlertCircle, X, Receipt, DollarSign, Percent } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

interface DetalleItem {
  productoId: number;
  nombre: string;
  cantidad: number;
  precio_unitario_compra: string;
  iva_porcentaje: string;
}

function CrearFacturaModal({ onClose, onSuccess }: Props) {
  const [remitosDisponibles, setRemitosDisponibles] = useState<Remito[]>([]);
  const [selectedRemitoId, setSelectedRemitoId] = useState<string>('');
  const [remitoDetalle, setRemitoDetalle] = useState<DetalleRemito | null>(null);
  
  const [numeroFactura, setNumeroFactura] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [tipo, setTipo] = useState('A');
  const [detalles, setDetalles] = useState<DetalleItem[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRemitos = async () => {
      setLoading(true);
      try {
        const data = await comprobantesService.getAvailableRemitos();
        setRemitosDisponibles(data);
        if (data.length > 0) {
          setSelectedRemitoId(String(data[0].id_remito));
        }
      } catch (err) { setError('Error al cargar remitos disponibles.'); } 
      finally { setLoading(false); }
    };
    fetchRemitos();
  }, []);
  
  useEffect(() => {
    if (!selectedRemitoId) {
        setRemitoDetalle(null);
        setDetalles([]);
        return;
    };
    const fetchRemitoDetalle = async () => {
        setLoading(true);
        try {
            const data = await comprobantesService.getRemitoById(Number(selectedRemitoId));
            setRemitoDetalle(data);
            
            if (data && Array.isArray(data.detalles)) {
                setDetalles(data.detalles.map(d => ({
                    productoId: d.producto?.id || 0,
                    nombre: d.producto?.nombre || 'Producto no encontrado',
                    cantidad: d.cantidad || 0,
                    precio_unitario_compra: (d.producto?.precio || 0).toFixed(2),
                    iva_porcentaje: '21',
                })));
            } else {
                setDetalles([]);
            }
        } catch (err) { setError('Error al cargar detalle del remito.'); }
        finally { setLoading(false); }
    };
    fetchRemitoDetalle();
  }, [selectedRemitoId]);

  const handleDetailChange = (index: number, field: keyof DetalleItem, value: string) => {
    const newDetalles = [...detalles];
    newDetalles[index] = { ...newDetalles[index], [field]: value };
    setDetalles(newDetalles);
  };
  
  const total = detalles.reduce((acc, item) => {
      const subtotal = Number(item.cantidad) * Number(item.precio_unitario_compra);
      const iva = subtotal * (Number(item.iva_porcentaje) / 100);
      return acc + subtotal + iva;
  }, 0);

  const handleSubmit = async () => {
    if (!selectedRemitoId || !numeroFactura || !fecha) {
        setError("Remito, número de factura y fecha son obligatorios.");
        return;
    }
    
    if (!remitoDetalle?.proveedor?.id_proveedor) {
        setError("No se pudo cargar la información del proveedor. Por favor, re-selecciona el remito.");
        return;
    }
    
    setLoading(true);
    setError(null);
    
    const facturaData = {
      numero: numeroFactura,
      fecha,
      tipo,
      proveedorId: remitoDetalle.proveedor.id_proveedor,
      idRemito: Number(selectedRemitoId),
      // --- CORRECCIÓN FINAL AQUÍ ---
      // Creamos un nuevo objeto solo con las propiedades que el backend espera, excluyendo "nombre".
      detalles: detalles.map(d => ({
          productoId: d.productoId,
          cantidad: Number(d.cantidad),
          precio_unitario_compra: Number(d.precio_unitario_compra),
          iva_porcentaje: Number(d.iva_porcentaje),
      }))
    };

    try {
      await comprobantesService.createFactura(facturaData);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la factura.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg">
        <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2"><Receipt /> Crear Nueva Factura</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-md flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">1. Seleccionar Remito</label>
                    <select value={selectedRemitoId} onChange={e => setSelectedRemitoId(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        {remitosDisponibles.map(r => <option key={r.id_remito} value={r.id_remito}>#{r.numero_remito || r.id_remito} - {r.proveedor?.nombre || 'Proveedor no asignado'}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">2. N° de Factura</label>
                    <input type="text" value={numeroFactura} onChange={e => setNumeroFactura(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">3. Fecha</label>
                    <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">4. Tipo</label>
                    <select value={tipo} onChange={e => setTipo(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                    </select>
                </div>
            </div>
            
            <div className="space-y-2">
                <h3 className="font-semibold">4. Detalle de Items</h3>
                {detalles.map((item, index) => (
                    <div key={item.productoId} className="grid grid-cols-4 gap-2 items-center p-2 border rounded-md">
                        <span className="col-span-4 md:col-span-1">{item.nombre} (x{item.cantidad})</span>
                        <div className="relative">
                            <DollarSign size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input type="number" value={item.precio_unitario_compra} onChange={e => handleDetailChange(index, 'precio_unitario_compra', e.target.value)} className="w-full p-2 pl-8 border rounded-md text-right" />
                        </div>
                         <div className="relative">
                            <Percent size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input type="number" value={item.iva_porcentaje} onChange={e => handleDetailChange(index, 'iva_porcentaje', e.target.value)} className="w-full p-2 pl-8 border rounded-md text-right" />
                        </div>
                        <span className="text-right font-medium">${((Number(item.cantidad) * Number(item.precio_unitario_compra)) * (1 + Number(item.iva_porcentaje)/100)).toFixed(2)}</span>
                    </div>
                ))}
            </div>
            <div className="text-right font-bold text-xl">
                Total: ${total.toFixed(2)}
            </div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t rounded-b-lg">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
            <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2">
                {loading ? <Loader className="animate-spin" size={20} /> : 'Guardar Factura'}
            </button>
        </div>
    </div>
  );
};

export default CrearFacturaModal;