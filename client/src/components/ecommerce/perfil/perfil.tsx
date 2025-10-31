import { useEffect, useState } from "react";
import { PerfilCompras, type Venta } from "./perfil-compras"
import { PerfilDatos } from "./perfil-datos"
import { PerfilHeader } from "./perfil-header"
import { Progress } from "../ui/progress";


interface Cliente{
    id:number;

    nombre:string;

    apellido:string;

    email:string;

    compras:Venta[]
}

export const Perfil=({id,onCloseSesion}:{id:number,onCloseSesion:()=>void})=>{
    const API_URL = import.meta.env.VITE_API_URL;

    const [cliente,setCliente] = useState<Cliente>()
    const [progressValue, setProgressValue] = useState(0);

    // 1. EFECTO DE ANIMACIÓN (Simulación de carga)
    useEffect(() => {
        // Solo animamos si aún no tenemos el cliente
        if (!cliente) {
            const interval = setInterval(() => {
                setProgressValue((prev) => {
                    // Incrementa el valor lentamente, se detiene en 95%
                    const newProgress = prev + 5; 
                    return newProgress < 95 ? newProgress : 95;
                });
            }, 500); // Incrementa cada medio segundo

            // Limpieza: detiene el intervalo cuando el componente se desmonta o 'cliente' cambia
            return () => clearInterval(interval);
        }
    }, [cliente]);

    async function getCliente(){
        if (!API_URL) {
            console.error("no está definido en .env");
            // Aquí podrías mostrar un error al usuario
            return;
        }

        try {
            const request = await fetch(`${API_URL}/cliente/${id}`);
            const response = await request.json();

            // 2. TERMINACIÓN DE LA BARRA DE PROGRESO
            setProgressValue(100); // Fija el valor a 100% inmediatamente

            // 3. RETRASO Y RENDERIZADO FINAL
            // Esperamos un breve momento (ej. 300ms) para que el CSS de la barra 
            // termine de animarse al 100% antes de mostrar el contenido.
            setTimeout(() => {
                setCliente(response);
            }, 300);

        } catch (error) {
            console.error("Error al obtener datos del cliente:", error);
            // Manejar error
        }
    }

    useEffect(()=>{
        getCliente()
    },[id])

    if (!cliente) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-96">
                    <Progress value={progressValue} />
                    <p className="text-center mt-2 text-gray-500">Cargando datos del cliente...</p>
                </div>
            </div>
        );
    }
    return (
        <main className="w-[60%] mx-auto h-full bg-white">
            <PerfilHeader></PerfilHeader>
            <div className="flex gap-5">
                <PerfilCompras ventas={cliente.compras}></PerfilCompras>
                <PerfilDatos onCloseSesion={onCloseSesion} nombre={cliente.nombre} apellido={cliente.apellido} correo={cliente.email}></PerfilDatos>
            </div>
        </main>
    )
}