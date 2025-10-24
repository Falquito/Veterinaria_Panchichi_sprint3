// src-front/pages/Dashboard.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
  Activity,
  FileDown
} from 'lucide-react';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

// Tipos simplificados para el dashboard (ajusta según tus datos reales)
interface Ingreso {
  fecha: string;
  total: number;
}

interface Egreso {
  fecha: string;
  montoTotal: number;
}

interface ProductoResumen {
  id: number;
  nombre: string;
  stock: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// --- Componentes Auxiliares ---

// Tarjeta para KPIs
const KpiCard = ({
  title,
  value,
  icon: Icon,
  colorClass = 'text-blue-600',
  format = 'number'
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  colorClass?: string;
  format?: 'number' | 'currency';
}) => {
  const formattedValue =
    format === 'currency'
      ? value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
      : value.toLocaleString('es-AR');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${colorClass}`}>{formattedValue}</p>
        </div>
        <div className={`p-3 rounded-lg bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
          <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
      </div>
    </div>
  );
};

// --- Componente Principal del Dashboard ---

export default function Dashboard() {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [egresos, setEgresos] = useState<Egreso[]>([]);
  const [productos, setProductos] = useState<ProductoResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref para exportar a PDF
  const pdfRef = useRef<HTMLDivElement>(null);

  // Exportar como PDF usando html-to-image (evita el problema de OKLCH)
  const handleExportPDF = async () => {
    if (!pdfRef.current) return;

    // Genero una imagen PNG del contenedor con alta resolución y fondo blanco
    const dataUrl = await toPng(pdfRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      // Excluir elementos (botón) con clase no-pdf
      filter: (node) =>
        !(node instanceof Element && node.classList.contains('no-pdf')),
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Creo imagen para saber su tamaño real
    const img = new Image();
    img.src = dataUrl;

    await new Promise((res) => {
      img.onload = () => res(null);
    });

    const imgWidth = pageWidth;
    const imgHeight = (img.height * imgWidth) / img.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Paginado si la imagen es más alta que una página
    while (heightLeft > 0) {
      position = -(imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`dashboard_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [resIngresos, resEgresos, resProds] = await Promise.all([
          fetch(`${API_BASE_URL}/facturas`),       // ingresos
          fetch(`${API_BASE_URL}/orden-de-pago`),  // egresos
          fetch(`${API_BASE_URL}/productos`)       // productos
        ]);

        if (!resIngresos.ok) throw new Error('Error al cargar ingresos (facturas)');
        if (!resEgresos.ok) throw new Error('Error al cargar egresos (órdenes de pago)');
        if (!resProds.ok) throw new Error('Error al cargar productos');

        const dataIngresos = await resIngresos.json();
        const dataEgresos = await resEgresos.json();
        const dataProds = await resProds.json();

        setIngresos(Array.isArray(dataIngresos) ? dataIngresos : []);
        setEgresos(Array.isArray(dataEgresos) ? dataEgresos : []);

        // Extraer info básica de productos para widget de stock bajo
        let productosPlanos: ProductoResumen[] = [];
        if (Array.isArray(dataProds)) {
          dataProds.forEach((dep: any) => {
            if (Array.isArray(dep.productos)) {
              dep.productos.forEach((p: any) => {
                productosPlanos.push({ id: p.id, nombre: p.nombre, stock: p.stock });
              });
            }
          });
          // Eliminar duplicados
          const uniqueProducts = Array.from(new Map(productosPlanos.map((p) => [p.id, p])).values());
          setProductos(uniqueProducts);
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar datos del dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Procesamiento de datos para gráficos (agrupados por mes)
  const monthlyData = useMemo(() => {
    const dataMap = new Map<string, { month: string; ingresos: number; egresos: number }>();

    const processItems = (items: (Ingreso | Egreso)[], type: 'ingresos' | 'egresos') => {
      items.forEach((item) => {
        try {
          const date = new Date((item as any).fecha);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthLabel = date.toLocaleString('es-AR', { month: 'short', year: 'numeric' });

          if (!dataMap.has(monthKey)) {
            dataMap.set(monthKey, { month: monthLabel, ingresos: 0, egresos: 0 });
          }

          const monthEntry = dataMap.get(monthKey)!;
          const amount =
            type === 'ingresos' ? (item as Ingreso).total : (item as Egreso).montoTotal;
          monthEntry[type] += Number(amount) || 0;
        } catch (e) {
          console.warn('Fecha inválida encontrada:', (item as any).fecha, e);
        }
      });
    };

    processItems(ingresos, 'ingresos');
    processItems(egresos, 'egresos');

    return Array.from(dataMap.entries())
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([_, value]) => ({
        ...value,
        resultado: value.ingresos - value.egresos
      }));
  }, [ingresos, egresos]);

  // Calcular KPIs Totales
  const kpis = useMemo(() => {
    const totalIngresos = ingresos.reduce((sum, i) => sum + (Number(i.total) || 0), 0);
    const totalEgresos = egresos.reduce((sum, e) => sum + (Number(e.montoTotal) || 0), 0);
    const resultadoNeto = totalIngresos - totalEgresos;
    const productosBajoStock = productos.filter((p) => p.stock > 0 && p.stock <= 10).length;

    return { totalIngresos, totalEgresos, resultadoNeto, productosBajoStock };
  }, [ingresos, egresos, productos]);

  const productosConStockBajo = useMemo(() => {
    return productos
      .filter((p) => p.stock > 0 && p.stock <= 10)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);
  }, [productos]);

  const currencyFormatter = (value: number | string) =>
    Number(value).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8" ref={pdfRef}>
      {/* Header + Botón Exportar */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard General</h1>
        <button
          type="button"
          onClick={handleExportPDF}
          className="no-pdf inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          title="Exportar a PDF"
        >
          <FileDown className="w-5 h-5" />
          Exportar PDF
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Ingresos Totales"
          value={kpis.totalIngresos}
          icon={TrendingUp}
          colorClass="text-green-600"
          format="currency"
        />
        <KpiCard
          title="Egresos Totales"
          value={kpis.totalEgresos}
          icon={TrendingDown}
          colorClass="text-red-600"
          format="currency"
        />
        <KpiCard
          title="Resultado Neto"
          value={kpis.resultadoNeto}
          icon={DollarSign}
          colorClass={kpis.resultadoNeto >= 0 ? 'text-blue-600' : 'text-red-600'}
          format="currency"
        />
        <KpiCard
          title="Productos Bajo Stock"
          value={kpis.productosBajoStock}
          icon={AlertTriangle}
          colorClass="text-yellow-600"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico Ingresos vs Egresos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[400px]">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ingresos vs Egresos Mensuales</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} interval={0} fontSize={12} />
              <YAxis tickFormatter={(value: number) => value.toLocaleString('es-AR')} fontSize={12} />
              <Tooltip formatter={(value: any) => currencyFormatter(value)} />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="ingresos" fill="#22c55e" name="Ingresos" radius={[4, 4, 0, 0]} />
              <Bar dataKey="egresos" fill="#ef4444" name="Egresos" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico Resultados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[400px]">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Resultado Mensual</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} interval={0} fontSize={12} />
              <YAxis tickFormatter={(value: number) => value.toLocaleString('es-AR')} fontSize={12} />
              <Tooltip formatter={(value: any) => currencyFormatter(value)} />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="resultado" name="Resultado (Ingresos - Egresos)" radius={[4, 4, 0, 0]}>
                {monthlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.resultado >= 0 ? '#3b82f6' : '#f87171'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Otros Elementos Útiles */}
      <div className="gap-30">
        {/* Productos con Bajo Stock */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
            Productos con Bajo Stock (Top 5)
          </h2>
          {productosConStockBajo.length > 0 ? (
            <ul className="space-y-3">
              {productosConStockBajo.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-yellow-700" />
                    <span className="text-sm font-medium text-gray-800">
                      {p.nombre} (ID: {p.id})
                    </span>
                  </div>
                  <span className="text-sm font-bold text-yellow-700">{p.stock} unidades</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              ¡Excelente! No hay productos con bajo stock.
            </p>
          )}
        </div>

       
      </div>
    </div>
  );
}