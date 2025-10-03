"use client";
import React, { useEffect, useState } from "react";
import { Warehouse, Search, X, Check } from "lucide-react";
import { useModal } from "../ui/animated-modal"; 

export default function DepositoSelectorModal({ onSelect, selectedDepositoId }) {
  const { setOpen } = useModal();
  const [depositos, setDepositos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { loadDepositos(); }, []);

  async function loadDepositos() {
    try {
      const res = await fetch("http://localhost:3000/depositos");
      const data = await res.json();
      setDepositos(data.items || []);
    } catch (e) {
      console.error("Error al cargar depósitos:", e);
    } finally {
      setLoading(false);
    }
  }

  const depositosFiltrados = depositos.filter((d) =>
    (d.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.direccion || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pick = (deposito) => {
    onSelect(deposito);
    setOpen(false);
  };

  return (
    <div className="max-w-2xl w-full max-h-[80vh] flex flex-col bg-white rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6  ">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Warehouse className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Seleccionar Depósito</h3>
            <p className="text-sm text-gray-600">{depositosFiltrados.length} depósitos disponibles</p>
          </div>
        </div>
      
      </div>

      {/* Search */}
      <div className="p-4 border border-b-gray-200 border-transparent">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : depositosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No se encontraron depósitos</div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {depositosFiltrados.map((d) => (
              <button
                key={d.id_deposito}
                onClick={() => pick(d)}
                className={`p-4 border rounded-lg text-left transition-all hover:shadow-md ${
                  selectedDepositoId === d.id_deposito
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Warehouse className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{d.nombre}</h4>
                        <span className="text-xs text-gray-500">ID: {d.id_deposito}</span>
                      </div>
                      {d.direccion && <p className="text-sm text-gray-600 mt-1">{d.direccion}</p>}
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                          d.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {d.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                  {selectedDepositoId === d.id_deposito && (
                    <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
