import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Package, Search, X, Building2, Eye, Calendar, DollarSign } from 'lucide-react';
import { Modal, ModalBody, ModalContent, useModal } from "../components/ui/animated-modal";

// Types
interface Proveedor {
  id_proveedor: number;
  nombre: string;
  cuit?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo: boolean;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  descripcion?: string;
  categoria?: string;
}

interface ProductoOrden {
  id?: number;
  producto: Producto | null;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface CreateOrdenDto {
  proveedorId: number;
  productos: {
    productoId: number;
    cantidad: number;
    precioUnitario: number;
  }[];
}

interface OrdenDeCompra {
  id_oc: number;
  fecha: string;
  total: string;
  productos: {
    id: number;
    cantidad: number;
    precioUnitario: number;
    producto: {
      id: number;
      nombre: string;
      descripcion: string;
      precio: number;
      categoria: {
        nombre: string;
      };
    };
  }[];
  proveedor: {
    id_proveedor: number;
    nombre: string;
    cuit?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
  };
}

const API_BASE = 'http://localhost:3000';


export default function OrdenCompraSystem() {
  return (
    <Modal>
      <OrdenCompraContent />
    </Modal>
  );
}

function OrdenCompraContent() {
  // Estados principales
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ordenes, setOrdenes] = useState<OrdenDeCompra[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Estados para vistas
  const [vistaActual, setVistaActual] = useState<'lista' | 'nueva'>('lista');

  // Estados del formulario
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);
  const [productosOrden, setProductosOrden] = useState<ProductoOrden[]>([{
    producto: null,
    descripcion: '',
    cantidad: 1,
    precioUnitario: 0,
    subtotal: 0
  }]);
  const [numeroOrden, setNumeroOrden] = useState('');

  // Estados para modales animados
  const [modalView, setModalView] = useState<'proveedor' | 'producto' | 'detalle' | null>(null);
  const [indiceProductoActual, setIndiceProductoActual] = useState(0);
  const [busquedaProveedor, setBusquedaProveedor] = useState('');
  const [busquedaProducto, setBusquedaProducto] = useState('');

  // Estados para modal de detalles
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenDeCompra | null>(null);

  const { setOpen } = useModal();

  const verDetallesOrden = (orden: OrdenDeCompra) => {
    setOrdenSeleccionada(orden);
    setModalView('detalle');
    setOpen(true);
  };

  // Cargar datos iniciales
  useEffect(() => {
    cargarProveedores();
    cargarProductos();
    cargarOrdenes();
    generarNumeroOrden();
  }, []);

  const generarNumeroOrden = () => {
    const fecha = new Date();
    const timestamp = Date.now().toString().slice(-6);
    setNumeroOrden(`OC-${fecha.getFullYear()}-${timestamp}`);
  };

  const cargarProveedores = async () => {
    try {
      const response = await fetch(`${API_BASE}/proveedores?limit=100`);
      const data = await response.json();
      setProveedores(data.items || data || []);
    } catch (error) {
      setError('Error al cargar proveedores');
      console.error('Error:', error);
    }
  };

  const cargarProductos = async () => {
    try {
      const res = await fetch(`${API_BASE}/productos`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();

      let rawList: any[] = [];

      if (Array.isArray(data) && data.length && Array.isArray(data[0]?.productos)) {
        rawList = data.flatMap((dep: any) => Array.isArray(dep?.productos) ? dep.productos : []);
      }
      else if (Array.isArray(data?.productos)) {
        rawList = data.productos;
      }
      else if (Array.isArray(data)) {
        rawList = data;
      }
      else {
        console.error('❌ Estructura no reconocida:', data);
        setProductos([]);
        setError('No se encontraron productos en la respuesta del servidor');
        return;
      }

      const byId = new Map<number, Producto>();
      for (const r of rawList) {
        const id = Number(r?.id ?? 0);
        if (!id) continue;

        const previo = byId.get(id);

        const normalizado: Producto = {
          id,
          nombre: String(r?.nombre ?? previo?.nombre ?? '').trim() || `Producto #${id}`,
          descripcion: String(r?.descripcion ?? previo?.descripcion ?? ''),
          precio: Number(r?.precio ?? previo?.precio ?? 0),
          stock: (Number(previo?.stock ?? 0) + Number(r?.stock ?? 0)) || 0,
          categoria: String(r?.nombreCategoria ?? r?.categoria?.nombre ?? previo?.categoria ?? ''),
        };

        byId.set(id, normalizado);
      }

      const lista = Array.from(byId.values());
      setProductos(lista);
    } catch (err: any) {
      console.error('Error cargando productos:', err);
      setError(`Error al cargar productos: ${err?.message ?? err}`);
      setProductos([]);
    }
  };

  const cargarOrdenes = async () => {
    try {
      const response = await fetch(`${API_BASE}/orden-de-compra`);
      const data = await response.json();
      // Ordenar por id_oc descendente (más reciente primero)
      const ordenesOrdenadas = (data || []).sort((a: OrdenDeCompra, b: OrdenDeCompra) => b.id_oc - a.id_oc);
      setOrdenes(ordenesOrdenadas);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
    }
  };

  const seleccionarProveedor = (proveedor: Proveedor) => {
    setProveedorSeleccionado(proveedor);
    setOpen(false);
    setModalView(null);
  };

  const seleccionarProducto = (producto: Producto) => {
    const nuevosProductos = [...productosOrden];
    nuevosProductos[indiceProductoActual] = {
      ...nuevosProductos[indiceProductoActual],
      producto,
      descripcion: producto.descripcion || producto.nombre,
      precioUnitario: 0,
      subtotal: 0
    };
    setProductosOrden(nuevosProductos);
    setOpen(false);
    setModalView(null);
  };

  const abrirModalProveedor = () => {
    setModalView('proveedor');
    setBusquedaProveedor('');
    setOpen(true);
  };

  const abrirModalProducto = (indice: number) => {
    setIndiceProductoActual(indice);
    setBusquedaProducto('');
    setModalView('producto');
    setOpen(true);
  };

  const actualizarCantidad = (indice: number, cantidad: number) => {
    const nuevosProductos = [...productosOrden];
    nuevosProductos[indice].cantidad = cantidad;
    nuevosProductos[indice].subtotal = cantidad * nuevosProductos[indice].precioUnitario;
    setProductosOrden(nuevosProductos);
  };

  const actualizarPrecio = (indice: number, precio: number) => {
    const nuevosProductos = [...productosOrden];
    nuevosProductos[indice].precioUnitario = precio;
    nuevosProductos[indice].subtotal = nuevosProductos[indice].cantidad * precio;
    setProductosOrden(nuevosProductos);
  };

  const agregarProducto = () => {
    setProductosOrden([...productosOrden, {
      producto: null,
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      subtotal: 0
    }]);
  };

  const eliminarProducto = (indice: number) => {
    if (productosOrden.length > 1) {
      setProductosOrden(productosOrden.filter((_, i) => i !== indice));
    }
  };

  const calcularTotal = () => {
    return productosOrden.reduce((total, item) => total + item.subtotal, 0);
  };

  const crearOrden = async () => {
    if (!proveedorSeleccionado) {
      setError('Debe seleccionar un proveedor');
      return;
    }

    const productosValidos = productosOrden.filter(p => p.producto && p.cantidad > 0);
    if (productosValidos.length === 0) {
      setError('Debe agregar al menos un producto');
      return;
    }

    // Validar que todos los productos tengan precio unitario
    const productosSinPrecio = productosValidos.filter(p => p.precioUnitario <= 0);
    if (productosSinPrecio.length > 0) {
      setError('Todos los productos deben tener un precio unitario mayor a 0');
      return;
    }

    setLoading(true);
    setError('');

    const ordenDto: CreateOrdenDto = {
      proveedorId: proveedorSeleccionado.id_proveedor,
      productos: productosValidos.map(p => ({
        productoId: p.producto!.id,
        cantidad: p.cantidad,
        precioUnitario: p.precioUnitario
      }))
    };

    console.log('Datos enviados al backend:', ordenDto); // Para debug

    try {
      const response = await fetch(`${API_BASE}/orden-de-compra`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ordenDto)
      });

      if (response.ok) {
        const resultado = await response.json();
        setSuccess(`Orden de compra registrada exitosamente. ID: ${resultado.id_oc}`);
        setProveedorSeleccionado(null);
        setProductosOrden([{
          producto: null,
          descripcion: '',
          cantidad: 1,
          precioUnitario: 0,
          subtotal: 0
        }]);
        generarNumeroOrden();
        cargarOrdenes();
        setTimeout(() => setVistaActual('lista'), 2000);
      } else {
        const errorText = await response.text();
        setError(`Error del servidor: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      setError(`Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const proveedoresFiltrados = proveedores.filter(p =>
    p.activo && p.nombre?.toLowerCase().includes(busquedaProveedor.toLowerCase())
  );

  const productosFiltrados = productos.filter(p =>
    p.nombre?.toLowerCase().includes(busquedaProducto.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Órdenes de Compra</h1>
              <p className="text-gray-600">Gestiona y registra las órdenes de compra de tu inventario</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setVistaActual('lista')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${vistaActual === 'lista'
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                <Eye className="mr-2 h-5 w-5 inline" />
                Ver Órdenes
              </button>
              <button
                onClick={() => setVistaActual('nueva')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${vistaActual === 'nueva'
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                <Plus className="mr-2 h-5 w-5 inline" />
                Nueva Orden
              </button>
            </div>
          </div>
        </div>

        {/* Vista de Lista */}
        {vistaActual === 'lista' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Historial de Órdenes</h3>
              <p className="text-sm text-gray-600 mt-1">{ordenes.length} órdenes registradas</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID Orden
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Proveedor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Productos
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {ordenes.map((orden) => (
                    <tr key={orden.id_oc} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Package className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-semibold text-gray-900">#{orden.id_oc}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                          {orden.fecha}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900">{orden.proveedor.nombre}</div>
                          <div className="text-sm text-gray-500">{orden.proveedor.cuit}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {orden.productos.map((item, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <span className="font-medium text-gray-900">{item.producto.nombre}</span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                x{item.cantidad}
                              </span>
                              {item.producto.categoria && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                  {item.producto.categoria.nombre}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center px-3 py-1.5 rounded-md bg-green-50 border border-green-200">
                          <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                          <span className="font-bold text-green-700">{parseFloat(orden.total).toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => verDetallesOrden(orden)}
                          className="inline-flex items-center px-3 py-1.5 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors font-medium text-sm border border-blue-200"
                        >
                          <Eye className="h-4 w-4 mr-1.5" />
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {ordenes.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">No hay órdenes registradas</div>
                  <div className="text-sm text-gray-600">Crea tu primera orden de compra haciendo clic en "Nueva Orden"</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vista de Nueva Orden */}
        {vistaActual === 'nueva' && (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-gray-900">Nueva Orden de Compra</h2>
                <div className="text-sm text-gray-500">
                  N° {numeroOrden}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Building2 className="mr-2 h-5 w-5" />
                    Proveedor
                  </h3>
                  <button
                    onClick={abrirModalProveedor}
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-lg font-medium"
                  >
                    <Building2 className="mr-2 h-5 w-5 inline" />
                    Seleccionar Proveedor
                  </button>
                </div>

                {proveedorSeleccionado ? (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="font-medium text-gray-900 mb-2">{proveedorSeleccionado.nombre}</div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>• CUIT: {proveedorSeleccionado.cuit || 'No disponible'}</div>
                      <div>• Email: {proveedorSeleccionado.email || 'No disponible'}</div>
                      <div>• Teléfono: {proveedorSeleccionado.telefono || 'No disponible'}</div>
                      {proveedorSeleccionado.direccion && (
                        <div>• Dirección: {proveedorSeleccionado.direccion}</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                    <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <div className="text-gray-500 font-medium">No se ha seleccionado ningún proveedor</div>
                    <div className="text-sm text-gray-400 mt-1">Haz clic en "Seleccionar Proveedor" para comenzar</div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Productos
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unit.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productosOrden.map((item, indice) => (
                      <tr key={indice} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <button
                            onClick={() => abrirModalProducto(indice)}
                            className="text-left w-full p-3 border border-gray-300 rounded-md hover:border-gray-500 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
                          >
                            {item.producto ? (
                              <div>
                                <div className="font-medium text-gray-900">{item.producto.nombre}</div>
                                <div className="text-sm text-gray-500">{item.descripcion}</div>
                                {item.producto.categoria && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                                    {item.producto.categoria}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="text-gray-500 flex items-center">
                                <Package className="mr-2 h-4 w-4" />
                                Seleccionar producto...
                              </div>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min="1"
                            value={item.cantidad}
                            onChange={(e) => actualizarCantidad(indice, parseInt(e.target.value) || 0)}
                            className="w-20 p-2 border border-gray-300 rounded-md text-center focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500 text-sm">$</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.precioUnitario}
                              onChange={(e) => actualizarPrecio(indice, parseFloat(e.target.value) || 0)}
                              className="w-28 p-2 border border-gray-300 rounded-md text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          ${item.subtotal.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => eliminarProducto(indice)}
                            disabled={productosOrden.length === 1}
                            className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={agregarProducto}
                    className="flex items-center text-black hover:text-gray-800 font-medium border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar producto
                  </button>
                  <div className="bg-black text-white px-6 py-3 rounded-lg">
                    <div className="text-sm opacity-80">Total de la Orden</div>
                    <div className="text-2xl font-bold">
                      ${calcularTotal().toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={crearOrden}
                    disabled={loading || !proveedorSeleccionado}
                    className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-lg transition-colors"
                  >
                    {loading ? 'Registrando...' : 'Registrar Orden'}
                  </button>
                  
                </div>
              </div>
            </div>
          </>
        )}

        {/* Alertas */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}
      </div>

      {/* Modal Animado */}
      <ModalBody>
        <ModalContent>
          {modalView === 'proveedor' && (
            <div className="w-full max-w-2xl">
              <div className="mb-5">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg mr-3">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Seleccionar Proveedor</h3>
                    <p className="text-gray-600 text-sm">Elige el proveedor para tu orden de compra</p>
                  </div>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={busquedaProveedor}
                    onChange={(e) => setBusquedaProveedor(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                </div>

                <div className="mt-2 text-sm text-gray-500">
                  {proveedoresFiltrados.length} de {proveedores.length} proveedores
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {proveedoresFiltrados.length > 0 ? (
                  <div className="space-y-3">
                    {proveedoresFiltrados.map((proveedor) => (
                      <div
                        key={proveedor.id_proveedor}
                        onClick={() => seleccionarProveedor(proveedor)}
                        className="group p-4 border-2 border-gray-200 rounded-xl hover:border-green-400 hover:shadow-md cursor-pointer transition-all duration-200"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2.5 bg-gradient-to-br from-green-50 to-green-100 rounded-md group-hover:from-green-100 group-hover:to-green-200 transition-all">
                            <Building2 className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                              {proveedor.nombre}
                            </div>
                            <div className="text-sm text-gray-600 mt-0.5">
                              <span className="font-medium">CUIT:</span> {proveedor.cuit || 'N/A'} • {proveedor.email || 'Sin email'}
                            </div>
                            {proveedor.direccion && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Dirección:</span> {proveedor.direccion}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
                      <Search className="h-8 w-8 text-gray-300" />
                    </div>
                    <div className="text-base font-medium text-gray-900">No se encontraron proveedores</div>
                    <div className="text-xs">Intenta con otros términos de búsqueda</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {modalView === 'producto' && (
            <div className="w-full max-w-2xl"> 
              <div className="mb-5">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl mr-3">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Catálogo de Productos</h3>
                    <p className="text-gray-600 text-sm">Selecciona los productos para tu orden</p>
                  </div>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar productos por nombre..."
                    value={busquedaProducto}
                    onChange={(e) => setBusquedaProducto(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>

                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-600">
                    {productosFiltrados.length} de {productos.length} productos
                  </span>
                  <span className="text-gray-600">
                    <span className="text-green-600 font-medium">
                      Disponibles: {productosFiltrados.filter(p => p.stock > 0).length}
                    </span>
                    {' • '}
                    <span className="text-red-600 font-medium">
                      Sin stock: {productosFiltrados.filter(p => p.stock === 0).length}
                    </span>
                  </span>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto overflow-x-hidden">
                {productosFiltrados.length > 0 ? (
                  <div className="space-y-3">
                    {productosFiltrados.map((producto) => (
                      <div
                        key={producto.id}
                        onClick={() => seleccionarProducto(producto)}
                        className="group p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md cursor-pointer transition-all duration-200"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
                            <Package className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 group-hover:text-blue-600 transition-colors truncate">
                              {producto.nombre}
                            </h4>

                            {producto.descripcion && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{producto.descripcion}</p>
                            )}

                            <div className="flex flex-wrap items-center gap-2">
                              {producto.categoria && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                  {producto.categoria}
                                </span>
                              )}
                              {producto.stock > 0 ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                  En stock: {producto.stock}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                  Sin stock
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-base font-medium text-gray-900 mb-1">No se encontraron productos</h3>
                    <p className="text-sm text-gray-500">
                      {busquedaProducto ? 'Intenta con otros términos de búsqueda' : 'No hay productos disponibles'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}


          {modalView === 'detalle' && ordenSeleccionada && (
            <div className="w-full max-w-5xl">
              {/* Header */}
              <div className="mb-6 border-b border-gray-200 pb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Orden de Compra #{ordenSeleccionada.id_oc}</h3>
                    <p className="text-gray-500 text-sm mt-1">Detalles completos de la orden</p>
                  </div>
                </div>
              </div>

              {/* Información General */}
              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Información General</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">ID de Orden</div>
                      <div className="font-semibold text-gray-900">#{ordenSeleccionada.id_oc}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Fecha</div>
                      <div className="font-semibold text-gray-900">{ordenSeleccionada.fecha}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Proveedor</div>
                      <div className="font-semibold text-gray-900">{ordenSeleccionada.proveedor.nombre}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Total</div>
                      <div className="font-semibold text-gray-900">${parseFloat(ordenSeleccionada.total).toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {(ordenSeleccionada.proveedor.cuit || ordenSeleccionada.proveedor.email || ordenSeleccionada.proveedor.telefono || ordenSeleccionada.proveedor.direccion) && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-500 mb-2">Información del Proveedor</div>
                    <div className="space-y-1 text-sm text-gray-700">
                      {ordenSeleccionada.proveedor.cuit && <div>CUIT: {ordenSeleccionada.proveedor.cuit}</div>}
                      {ordenSeleccionada.proveedor.email && <div>Email: {ordenSeleccionada.proveedor.email}</div>}
                      {ordenSeleccionada.proveedor.telefono && <div>Teléfono: {ordenSeleccionada.proveedor.telefono}</div>}
                      {ordenSeleccionada.proveedor.direccion && <div>Dirección: {ordenSeleccionada.proveedor.direccion}</div>}
                    </div>
                  </div>
                )}
              </div>

              {/* Detalle de Productos */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Detalle de Productos</h4>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                      <div className="bg-gray-50 px-6 py-3 grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                        <div className="col-span-5">Producto</div>
                        <div className="col-span-2">Categoría</div>
                        <div className="col-span-2 text-center">Cantidad</div>
                        <div className="col-span-2 text-right">Precio Unit.</div>
                        <div className="col-span-1 text-right">Subtotal</div>
                      </div>

                      {ordenSeleccionada.productos.map((item, index) => (
                        <div
                          key={index}
                          className={`px-6 py-4 grid grid-cols-12 gap-4 items-center ${index !== ordenSeleccionada.productos.length - 1 ? 'border-b border-gray-200' : ''
                            }`}
                        >
                          <div className="col-span-5 flex items-center space-x-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <Package className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{item.producto.nombre}</div>
                              {item.producto.descripcion && (
                                <div className="text-sm text-gray-500 mt-0.5">{item.producto.descripcion}</div>
                              )}
                            </div>
                          </div>
                          <div className="col-span-2">
                            {item.producto.categoria && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                {item.producto.categoria.nombre}
                              </span>
                            )}
                          </div>
                          <div className="col-span-2 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700">
                              {item.cantidad} {item.cantidad === 1 ? 'unidad' : 'unidades'}
                            </span>
                          </div>
                          <div className="col-span-2 text-right text-gray-700 font-medium">
                            ${item.precioUnitario}
                          </div>
                          <div className="col-span-1 text-right text-gray-900 font-bold">
                            ${(item.cantidad * item.precioUnitario).toFixed(2)}
                          </div>
                        </div>
                      ))}

                      <div className="bg-blue-50 px-6 py-4 grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-11 text-right font-bold text-gray-700">
                          Total de unidades:
                        </div>
                        <div className="col-span-1 text-right font-bold text-blue-700">
                          {ordenSeleccionada.productos.reduce((sum, item) => sum + item.cantidad, 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Total */}
              <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Total de la Orden</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${parseFloat(ordenSeleccionada.total).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalContent>
      </ModalBody>
    </div>
  );
}