"use client";
import React from "react";
import { Building2, Search } from "lucide-react";
import { type Proveedor } from "../../types/orden-de-compra";

export default function ProveedorPickerContent({
  proveedores, total, q, onQChange, onSelect,
}: {
  proveedores: Proveedor[]; total: number; q: string;
  onQChange: (v: string) => void; onSelect: (p: Proveedor) => void;
}) {
  return (
    <div
      className="w-full max-w-2xl pointer-events-auto"  // ✅ Agrega esto
      onClick={(e) => e.stopPropagation()}  // ✅ Agrega esto
    >
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Building2 className="h-6 w-6 mr-3 text-gray-700" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Seleccionar Proveedor</h3>
            <p className="text-gray-600">Elige el proveedor para tu orden</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text" placeholder="Buscar por nombre..."
            value={q} onChange={(e) => onQChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
          />
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {proveedores.length} de {total} proveedores
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {proveedores.length ? (
          <div className="space-y-3">
            {proveedores.map((p) => (
              <div
                key={p.id_proveedor}
                role="button"
                tabIndex={0}
                onMouseDown={() => onSelect(p)}  // ✅ Cambia onClick por onMouseDown
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all hover:shadow-md"
              >
                <div className="font-semibold text-gray-900">{p.nombre}</div>
                <div className="text-sm text-gray-500 mt-1">
                  CUIT: {p.cuit || "N/A"} • {p.email || "Sin email"}
                </div>
                {p.direccion && <div className="text-sm text-gray-500">{p.direccion}</div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No se encontraron proveedores</div>
        )}
      </div>
    </div>
  );
}
