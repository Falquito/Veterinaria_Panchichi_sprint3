export const ButtonPerfil = ({text}:{text:string})=>{

    return (
        <button className="transition-all bg-cyan-500 text-white p-2 shadow-md rounded-md font-medium hover:bg-cyan-600 hover:shadow-xl hover:cursor-pointer">{text}</button>
    )
}