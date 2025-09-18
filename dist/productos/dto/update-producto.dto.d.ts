declare class DepositoStockDto {
    IdDeposito: number;
    cantidad: number;
}
export declare class UpdateProductoDto {
    nombre?: string;
    descripcion?: string;
    precio?: number;
    categoriaId?: number;
    depositos?: DepositoStockDto[];
}
export {};
