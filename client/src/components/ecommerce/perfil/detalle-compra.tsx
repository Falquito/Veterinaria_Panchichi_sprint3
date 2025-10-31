// Archivo: ./detalle-compra.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PerfilHeader } from './perfil-header';
import type { DetalleVenta, Venta } from './perfil-compras';
import { ClipboardCheck, ClipboardX } from 'lucide-react';
import { Progress } from '../ui/progress';
// Importa las interfaces necesarias desde el archivo donde estén definidas

export const DetalleCompra = () => {
    // Obtiene el 'id' de la ruta URL, definido en <Route path="/detalle-compra/:id">
    const { id } = useParams<{ id: string }>(); 
    const API_URL = import.meta.env.VITE_API_URL;
    
    const [venta, setVenta] = useState<Venta | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetalles = async () => {
            if (!id || !API_URL) return;

            try {
                const request = await fetch(`${API_URL}/ventas/${id}`);
                if (!request.ok) throw new Error('Venta no encontrada');
                const response = await request.json();
                setVenta(response);
            } catch (error) {
                console.error("Error fetching venta details:", error);
            } finally {
                // Fija un pequeño delay para simular carga visual (opcional)
                setTimeout(() => setIsLoading(false), 500); 
            }
        };

        fetchDetalles();
    }, [id, API_URL]);

    if (isLoading) {
        // Muestra el componente de carga
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-96">
                    <Progress value={100} /> {/* Ya que es una carga corta, puede ir directo a 100% o usar un spinner */}
                    <p className="text-center mt-2 text-gray-500">Buscando detalles del pedido #{id}...</p>
                </div>
            </div>
        );
    }

    if (!venta) {
        return (
            <main className="w-[60%] mx-auto p-4">
                <PerfilHeader />
                <h2 className="text-xl font-bold text-red-500">Error: Detalle de compra no encontrado.</h2>
            </main>
        );
    }

    // Contenido Final con los Detalles de la Compra
    return (
        <>
        <main className="w-[80%] mx-auto p-4 bg-white shadow-lg rounded-lg">
            <PerfilHeader />
            <h1 className="text-3xl font-bold mb-6 mt-4">Detalles de Compra #{venta.id_venta}</h1>
            
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 border rounded-lg bg-zinc-50">
                <p><span className="font-semibold">Fecha:</span> {new Date(venta.fecha).toLocaleDateString()}</p>
                <p><span className="font-semibold">Total Pagado:</span> ${venta.total?.toFixed(2)}</p>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Productos</h2>
            
            <div className="space-y-4">
                {venta.detalles.map((detalle: DetalleVenta, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border-b">
                        <div className="flex-1">
                            <img className='h-10 w-10' src={detalle.producto.ImagenURL} alt="" />
                            <p className="font-bold">{detalle.producto.nombre}</p>
                            <p className="text-sm text-gray-500">{detalle.producto.descripcion}</p>
                        </div>
                        <div className="w-1/4 text-right">
                            <p>Cant: <span className="font-semibold">{detalle.cantidad}</span></p>
                            <p>Precio Unit: ${detalle.precio_unitario.toFixed(2)}</p>
                        </div>
                        <div className="w-1/4 text-right">
                            <p className="font-bold text-lg">${(detalle.cantidad * detalle.precio_unitario).toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>

        </main>
        
        <section className='mt-10 w-[80%] mx-auto p-4 bg-white shadow-lg rounded-lg flex flex-col gap-2'>
    {/* <h1 className="font-bold text-2xl"> Pago </h1> */}
    {/* <hr />
    <p>Metodo de pago: {venta.metodo_de_pago}</p> */}

    {/* AQUÍ ESTÁ LA CORRECCIÓN:
      1. Usamos '&&' para decir "si esto es verdad, renderiza lo que sigue".
      2. Lo que sigue es TU lógica ternaria, pero esta vez sin las llaves {} extra.
    */}
    {/* {venta.metodo_de_pago !== "Paypal" && (
        <>
            {venta.estado ? (
                <div className='flex gap-5 border border-emerald-500 p-2 rounded-md items-center'>
                    <ClipboardCheck className="text-emerald-500" />
                    <p>Comprobante verificado.</p>
                </div>
            ) : (
                <div className='flex gap-5 border border-red-500 p-2 rounded-md items-center'>
                    <ClipboardX className="text-red-500" />
                    <p>Comprobante no verificado.</p>
                </div>
            )}
        </>
    )} */}
    
</section>
        </>
    );
};