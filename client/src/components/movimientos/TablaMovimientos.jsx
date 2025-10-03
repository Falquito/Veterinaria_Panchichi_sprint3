"use client";
import React from "react";
import { Eye, Package } from "lucide-react";
import { useModal } from "../ui/animated-modal"; // ajustá la ruta si cambia

// Recibe: movimientos (ya filtrados), onSelect(id), y helpers de formato/estilo
export default function TablaMovimientos({
  movimientos,
  onSelect,
  formatFecha,
  getTipoBadge,
  getTipoLabel,
  getTipoIcon,
}) {
  const { setOpen } = useModal();

  const abrirDetalle = (id) => {
    onSelect(id);   // setear el movimiento seleccionado en el padre
    setOpen(true);  // abrir el modal de detalle (proveído por <Modal>)
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            MOVIMIENTO
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            TIPO
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            FECHA
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            PRODUCTO
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            DEPÓSITO
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            CANTIDAD
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            MOTIVO
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ACCIONES
          </th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {movimientos.length === 0 ? (
          <tr>
            <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
              No se encontraron movimientos
            </td>
          </tr>
        ) : (
          movimientos.map((mov) => (
            <tr key={`${mov.movimiento_id}-${mov.linea_id}`} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">#{mov.movimiento_id}</div>
                    <div className="text-sm text-gray-500">Línea {mov.linea_id}</div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getTipoBadge(mov.tipo)}`}>
                    {getTipoIcon(mov.tipo)}
                    {getTipoLabel(mov.tipo)}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatFecha(mov.fecha_texto, mov.fecha_normalizada)}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ID: {mov.producto_id}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                Depósito {mov.deposito_id}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-semibold text-gray-900">
                  {mov.cantidad} unidades
                </span>
              </td>

              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                <div className="truncate">
                  {mov.motivo || "Sin motivo especificado"}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => abrirDetalle(mov.movimiento_id)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Ver Detalle
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
