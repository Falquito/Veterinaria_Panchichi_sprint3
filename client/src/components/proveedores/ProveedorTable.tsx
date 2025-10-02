import { Edit, Trash2, Package, AlertCircle } from 'lucide-react';
import type { Proveedor } from '../../types/proveedor.ts';
import { proveedoresService } from '../../services/proveedoresService.ts';

interface Props {
  proveedores: Proveedor[];
  loading: boolean;
  error: string | null;
  onEdit: (proveedor: Proveedor) => void;
  onDeleteSuccess: () => void;
}

export function ProveedorTable({ proveedores, loading, error, onEdit, onDeleteSuccess }: Props) {

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres archivar este proveedor?')) {
      try {
        await proveedoresService.deleteProveedor(id);
        onDeleteSuccess();
      } catch (err) {
        alert(`Error al archivar: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Cargando proveedores...</div>;
  }

  if (error) {
    return <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2"><AlertCircle size={16}/> {error}</div>;
  }
  
  if (proveedores.length === 0) {
    return (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron proveedores</h3>
          <p className="text-gray-500">Intenta con otra búsqueda o crea un nuevo proveedor.</p>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUIT</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {proveedores.map((p) => (
                    <tr key={p.id_proveedor} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.cuit}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.telefono}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                p.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {p.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                                <button onClick={() => onEdit(p)} className="p-1 text-gray-400 hover:text-blue-600 rounded">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(p.id_proveedor)} className="p-1 text-gray-400 hover:text-red-600 rounded">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}