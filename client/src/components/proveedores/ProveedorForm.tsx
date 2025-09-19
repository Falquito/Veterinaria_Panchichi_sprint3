import React, { useState, useEffect } from 'react';
import { useModal } from '../ui/animated-modal';
import { proveedoresService } from '../../services/proveedoresService.ts';
import type { Proveedor, NewProveedorPayload } from '../../types/proveedor.ts';

interface Props {
  initialData?: Proveedor | null;
  onSuccess: () => void;
}

export const ProveedorForm: React.FC<Props> = ({ initialData, onSuccess }) => {
  const { setOpen } = useModal();
  const [formData, setFormData] = useState<NewProveedorPayload>({
    nombre: '',
    cuit: '',
    email: '',
    telefono: '',
    direccion: '',
  });
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        cuit: initialData.cuit || '',
        email: initialData.email || '',
        telefono: initialData.telefono || '',
        direccion: initialData.direccion || '',
      });
    } else {
        setFormData({ nombre: '', cuit: '', email: '', telefono: '', direccion: '' });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && initialData) {
        await proveedoresService.updateProveedor(initialData.id_proveedor, formData);
      } else {
        await proveedoresService.createProveedor(formData);
      }
      onSuccess();
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Ocurrió un error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      </h2>

      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre *</label>
        <input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
      </div>

      <div>
        <label htmlFor="cuit" className="block text-sm font-medium text-gray-700">CUIT</label>
        <input id="cuit" name="cuit" value={formData.cuit} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      
      <div>
        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
        <input id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      
      <div>
        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label>
        <input id="direccion" name="direccion" value={formData.direccion} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border rounded-md">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md disabled:bg-gray-400">
          {loading ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};