import { useNavigate } from "react-router";
import { ButtonPerfil } from "./perfil-button"

interface CardCompra {
fecha:string,monto:number,numero:number
}


export const CardCompra = ({fecha, monto, numero}:CardCompra)=>{
        const navigate = useNavigate();
        const handleClick=()=>{navigate(`/detalle-compra/${numero}`)}
    return(
        <>
        <div className="flex w-[90%] mx-auto shadow-md rounded-2xl bg-zinc-100 p-2 h-32 my-5">
            <div className="w-[60%] flex flex-col gap-2">
                <div>
                    <span className="font-semibold">Numero de pedido: </span>
                    <span>{numero}</span>
                </div>
                <div>
                    <span className="font-semibold">Monto: </span>
                    <span>$ {monto}</span>
                </div>
            </div>
            <div className="w-[40%] flex flex-col items-center justify-between">
                <div>
                    <span className="font-semibold">Fecha: </span>
                    <span>{fecha}</span>
                </div>
                <div onClick={()=>handleClick()}>

                    <ButtonPerfil text="VER DETALLE"></ButtonPerfil>
                </div>
            </div>
        </div>
        </>
    )

}