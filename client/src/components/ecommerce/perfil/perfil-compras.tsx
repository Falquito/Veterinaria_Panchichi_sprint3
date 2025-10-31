import { ShoppingCart } from "lucide-react";
import { CardCompra } from "./compra-card"

export interface Venta{
    id_venta:number;
    fecha:string;
    total:number;
    detalles:DetalleVenta[]
    metodo_de_pago:string;
    estado:boolean
}

export interface DetalleVenta{
    cantidad:number;

    precio_unitario:number;

    producto:Producto
}

interface Producto {
    id:number;

    nombre:string;
    descripcion:string;
    precio:number;
    ImagenURL:string
}

export const PerfilCompras = ({ventas}:{ventas:Venta[]})=>{
    return (
        <section className="w-[60%] h-full rounded-2xl bg-zinc-50 shadow-md">
            <h1 className="ml-5 mt-5 flex gap-2"><ShoppingCart className="bg-cyan-500 p-1 rounded-xl text-white"></ShoppingCart>Mis compras</h1>
            {ventas.map(venta=>(
                <>
                    <CardCompra key={venta.id_venta} fecha={venta.fecha} monto={venta.total} numero={venta.id_venta}></CardCompra>  
                
                </>
            ))}
  
        </section>
    )
}