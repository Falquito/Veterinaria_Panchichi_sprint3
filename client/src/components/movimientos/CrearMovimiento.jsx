"use client";
import React, { useMemo, useState } from "react";
import { Plus, AlertCircle, Package, Trash2, Check } from "lucide-react";
import { Modal, ModalBody, ModalContent, useModal } from "../ui/animated-modal";
import ProductoSelectorModal from "./ProductoSelectorModal"; 
import DepositoSelectorModal from "./DepositoSelectorModal";  

export default function CrearMovimiento({ onSuccess }) {
  const { setOpen } = useModal(); // este es el modal "padre" del formulario
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [success, setSuccess]   = useState(false);

  const [currentLineIndex, setCurrentLineIndex] = useState(null);
  const [formData, setFormData] = useState({
    tipo: "INS",
    motivo: "",
    observaciones: "",
    detalle: [],
  });

  const fechaPreview = useMemo(() => {
    try {
      return new Date().toLocaleString("es-AR", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "";
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleProductoSelect = (producto) => {
    if (currentLineIndex !== null) {
      const detalle = [...formData.detalle];
      detalle[currentLineIndex] = {
        ...detalle[currentLineIndex],
        idProducto: producto.id,
        productoNombre: producto.nombre,
        productoDescripcion: producto.descripcion,
      };
      setFormData((p) => ({ ...p, detalle }));
      setCurrentLineIndex(null);
    }
  };

  const handleDepositoSelect = (deposito) => {
    if (currentLineIndex !== null) {
      const detalle = [...formData.detalle];
      detalle[currentLineIndex] = {
        ...detalle[currentLineIndex],
        idDeposito: deposito.id_deposito,
        depositoNombre: deposito.nombre,
      };
      setFormData((p) => ({ ...p, detalle }));
      setCurrentLineIndex(null);
    }
  };

  const handleCantidadChange = (idx, value) => {
    const detalle = [...formData.detalle];
    detalle[idx] = { ...detalle[idx], cantidad: value === "" ? "" : Number(value) };
    setFormData((p) => ({ ...p, detalle }));
  };

  const addLinea = () => {
    setFormData((p) => ({
      ...p,
      detalle: [
        ...p.detalle,
        { cantidad: 1, idProducto: "", idDeposito: "", productoNombre: "", depositoNombre: "" },
      ],
    }));
  };

  const removeLinea = (i) => {
    setFormData((p) => ({ ...p, detalle: p.detalle.filter((_, idx) => idx !== i) }));
  };

  const validateForm = () => {
    if (!formData.tipo || !formData.motivo) return "Completa los campos obligatorios";
    if (!formData.detalle.length) return "Agregá al menos una línea";
    for (let i = 0; i < formData.detalle.length; i++) {
      const l = formData.detalle[i];
      if (!l.idProducto || !l.idDeposito || !l.cantidad || Number(l.cantidad) <= 0) {
        return `La línea ${i + 1} tiene datos incompletos o inválidos`;
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    setLoading(true); setError(null); setSuccess(false);

    const err = validateForm();
    if (err) { setError(err); setLoading(false); return; }

    try {
      const payload = {
        tipo: formData.tipo,
        motivo: formData.motivo,
        observaciones: formData.observaciones,
        detalle: formData.detalle.map((d) => ({
          idProducto: d.idProducto,
          idDeposito: d.idDeposito,
          cantidad: Number(d.cantidad),
        })),
      };

      // La fecha NO viaja: la pone el backend
      const res = await fetch("http://localhost:3000/api/v2/movimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let errData = {};
        try { errData = await res.json(); } catch {}
        throw new Error(errData.message || "Error al crear el movimiento");
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess && onSuccess();
        setOpen(false);
      }, 1200);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col bg-white rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Nuevo Movimiento</h2>
              <p className="text-sm text-gray-600">Registra un nuevo movimiento de inventario</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Movimiento creado exitosamente</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Info General */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                Información General
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Movimiento *</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="INS">Ingreso</option>
                    <option value="OUT">Salida</option>
                    <option value="UPD">Actualización</option>
                  </select>
                </div>

                {/* Reemplazo del input de fecha: bloque visual consistente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha (automática)
                  </label>
                  <input
                    type="text"
                    value={fechaPreview}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    title="La fecha se establecerá automáticamente en el servidor al guardar"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    La fecha y hora se guardarán automáticamente en el servidor.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Motivo *</label>
                  <input
                    type="text"
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleInputChange}
                    placeholder="Ej: Compra a proveedor, Venta, Ajuste de inventario..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                  <textarea
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleInputChange}
                    placeholder="Información adicional..."
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Detalle */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  Detalle de Productos
                </h3>
                <button
                  type="button"
                  onClick={addLinea}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Línea
                </button>
              </div>

              {formData.detalle.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No hay líneas de detalle agregadas</p>
                  <button
                    type="button"
                    onClick={addLinea}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar primera línea
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.detalle.map((linea, idx) => (
                    <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center font-bold text-blue-700">
                          {idx + 1}
                        </div>

                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* ---- Producto ---- */}
                            <Modal>
                              <ProductoPickButton
                                linea={linea}
                                onClickOpen={() => setCurrentLineIndex(idx)}
                              />
                              <ModalBody>
                                <ModalContent>
                                  <ProductoSelectorModal
                                    onSelect={handleProductoSelect}
                                    selectedProductoId={linea.idProducto || null}
                                  />
                                </ModalContent>
                              </ModalBody>
                            </Modal>

                            {/* ---- Depósito ---- */}
                            <Modal>
                              <DepositoPickButton
                                linea={linea}
                                onClickOpen={() => setCurrentLineIndex(idx)}
                              />
                              <ModalBody>
                                <ModalContent>
                                  <DepositoSelectorModal
                                    onSelect={handleDepositoSelect}
                                    selectedDepositoId={linea.idDeposito || null}
                                  />
                                </ModalContent>
                              </ModalBody>
                            </Modal>

                            {/* ---- Cantidad ---- */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Cantidad <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={String(linea.cantidad)}
                                onChange={(e) => handleCantidadChange(idx, e.target.value)}
                                placeholder="Unidades"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        {formData.detalle.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLinea(idx)}
                            className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar línea"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {formData.detalle.length > 0 && (
                <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-blue-900 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Total de líneas: {formData.detalle.length}
                    </span>
                    <span className="font-semibold text-blue-900">
                      Total unidades: {formData.detalle.reduce((sum, l) => sum + (Number(l.cantidad) || 0), 0)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-lg transition-all border border-gray-300"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || success}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creando...
                </>
              ) : success ? (
                <>
                  <Check className="w-5 h-5" />
                  Creado
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Crear Movimiento
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Botones que abren los modales anidados ---------- */

function ProductoPickButton({ linea, onClickOpen }) {
  const { setOpen } = useModal(); // provider del Modal más cercano
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Producto <span className="text-red-500">*</span>
      </label>
      <button
        type="button"
        onClick={() => { onClickOpen(); setOpen(true); }}
        className={`w-full px-3 py-2.5 border rounded-lg text-left transition-all ${
          linea.idProducto
            ? "border-green-300 bg-green-50 hover:bg-green-100"
            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
        }`}
      >
        {linea.productoNombre ? (
          <div>
            <div className="font-medium text-gray-900">{linea.productoNombre}</div>
            <div className="text-xs text-gray-500">ID: {linea.idProducto}</div>
          </div>
        ) : (
          <span className="text-gray-500">Seleccionar producto...</span>
        )}
      </button>
    </div>
  );
}

function DepositoPickButton({ linea, onClickOpen }) {
  const { setOpen } = useModal(); // provider del Modal más cercano
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Depósito <span className="text-red-500">*</span>
      </label>
      <button
        type="button"
        onClick={() => { onClickOpen(); setOpen(true); }}
        className={`w-full px-3 py-2.5 border rounded-lg text-left transition-all ${
          linea.idDeposito
            ? "border-green-300 bg-green-50 hover:bg-green-100"
            : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
        }`}
      >
        {linea.depositoNombre ? (
          <div>
            <div className="font-medium text-gray-900">{linea.depositoNombre}</div>
            <div className="text-xs text-gray-500">ID: {linea.idDeposito}</div>
          </div>
        ) : (
          <span className="text-gray-500">Seleccionar depósito...</span>
        )}
      </button>
    </div>
  );
}
