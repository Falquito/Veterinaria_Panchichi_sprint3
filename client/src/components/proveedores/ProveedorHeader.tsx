import { Plus, Search } from 'lucide-react';

interface Props {
  onCreate: () => void;
  search: string;
  setSearch: (value: string) => void;
}

export function ProveedorHeader({ onCreate, search, setSearch }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proveedores</h1>
          <p className="text-sm text-gray-500 mt-1">Administra tus proveedores y su información.</p>
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-3">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar proveedor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button
                onClick={onCreate}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
                <Plus className="w-4 h-4" />
                Nuevo Proveedor
            </button>
        </div>
      </div>
    </div>
  );
}