"use client";
import React, { useEffect, useState } from "react";
import { Package, AlertCircle, TrendingUp, ArrowDown, Plus } from "lucide-react";
import { Modal, ModalTrigger, ModalBody, ModalContent } from "../components/ui/animated-modal";
import CrearMovimientoContent from "../components/movimientos/CrearMovimiento";
import MovimientoDetalleContent from "../components/movimientos/MovimientoDetalle";
import TablaMovimientos from "../components/movimientos/TablaMovimientos"; 

export default function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [selectedMovimientoId, setSelectedMovimientoId] = useState(null);

  const movimientosFiltrados = movimientos.filter((m) => {
    const matchesSearch =
      m.movimiento_id.toString().includes(searchTerm) ||
      m.producto_id.toString().includes(searchTerm) ||
      (m.motivo && m.motivo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTipo = filtroTipo === "" || m.tipo === filtroTipo;
    return matchesSearch && matchesTipo;
  });

  useEffect(() => { loadMovimientos(); }, []);
  async function loadMovimientos() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("http://localhost:3000/api/movimientos");
      if (!res.ok) throw new Error("Error al obtener los movimientos");
      const data = await res.json();
      setMovimientos(data.data || []);
    } catch (e) {
      setError("Error al cargar los movimientos");
    } finally {
      setLoading(false);
    }
  }

  const formatFecha = (t, n) => (n ? new Date(n).toLocaleDateString("es-AR") : (t || "Sin fecha"));
  const getTipoLabel = (t) => (t === "INS" ? "Ingreso" : t === "OUT" ? "Salida" : t === "UPD" ? "Actualización" : t);
  const getTipoBadge = (t) =>
    t === "INS" ? "bg-green-100 text-green-800" :
    t === "OUT" ? "bg-red-100 text-red-800" :
    t === "UPD" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800";
  const getTipoIcon = (t) =>
    t === "INS" ? <TrendingUp className="w-4 h-4" /> :
    t === "OUT" ? <ArrowDown className="w-4 h-4" /> :
    <Package className="w-4 h-4" />;

  const handleCrearSuccess = () => loadMovimientos();

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w mx-auto">
        {/* Header + Modal Crear */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Movimientos</h1>
              <p className="text-gray-600 mt-1">Gestiona el historial de movimientos de inventario</p>
            </div>

            <Modal>
              <ModalTrigger className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm">
                <Plus className="w-5 h-5" />
                Nuevo Movimiento
              </ModalTrigger>
              <ModalBody>
                <ModalContent>
                  <CrearMovimientoContent onSuccess={handleCrearSuccess} />
                </ModalContent>
              </ModalBody>
            </Modal>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-semibold text-gray-900">{movimientos.length}</div>
                <div className="text-sm text-gray-600">Total Movimientos</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-semibold text-gray-900">
                  {movimientos.filter(m => m.tipo === 'INS').length}
                </div>
                <div className="text-sm text-gray-600">Ingresos</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowDown className="w-8 h-8 text-red-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-semibold text-gray-900">
                  {movimientos.filter(m => m.tipo === 'OUT').length}
                </div>
                <div className="text-sm text-gray-600">Salidas</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-gray-900">Filtros y Búsqueda</h3>
              <p className="text-sm text-gray-600">{movimientosFiltrados.length} de {movimientos.length} movimientos encontrados</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar movimientos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select 
              value={filtroTipo} 
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              <option value="INS">Ingresos</option>
              <option value="OUT">Salidas</option>
              <option value="UPD">Actualización</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

         <Modal>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando movimientos...</p>
              </div>
            ) : (
              <TablaMovimientos
                movimientos={movimientosFiltrados}
                onSelect={(id) => setSelectedMovimientoId(id)}
                formatFecha={formatFecha}
                getTipoBadge={getTipoBadge}
                getTipoLabel={getTipoLabel}
                getTipoIcon={getTipoIcon}
              />
            )}
          </div>

    
          <ModalBody>
            <ModalContent>
              <MovimientoDetalleContent movimientoId={selectedMovimientoId} />
            </ModalContent>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
}