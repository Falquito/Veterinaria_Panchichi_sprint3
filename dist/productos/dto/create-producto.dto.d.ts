export declare class DepositoStockDto {
    IdDeposito: number;
    cantidad: number;
}
export declare class ProveedoresId {
    proveedoresId: number;
}
export declare class CreateProductoDto {
    nombre: string;
    descripcion: string;
    precio: number;
    categoriaId: number;
    fechaelaboracion: string;
    fechaVencimiento: string;
    depositos: DepositoStockDto[];
    proveedoresId: ProveedoresId[];
}
