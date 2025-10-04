interface detalleFactura {
    id:number,
        cantidad:number,
        producto:{
            id:number,
            nombre:string
        }
}

export const Acordion=({facturaDetalles}:{facturaDetalles:detalleFactura})=>{
    return(
        <div className=" join join-vertical bg-base-100 rounded-2xl">
            <div className="border border-emerald-500 p-5 rounded-2xl  bg-white backdrop-blur-xl collapse collapse-arrow join-item border-base-300 border">
                <input type="radio" name="my-accordion-4"/>
                <div className="collapse-title font-semibold">{facturaDetalles.producto.nombre}</div>
                <div className="collapse-content text-sm">Cantidad: {facturaDetalles.cantidad} ID Producto: {facturaDetalles.producto.id} </div>
            </div>
        </div>
    )
}