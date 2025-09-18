export declare class CreateOrdenDeCompraPorProductoDto {
    productoId: number;
    cantidad: number;
}
export declare class CreateOrdenDeCompraDto {
    proveedorId: number;
    productos: CreateOrdenDeCompraPorProductoDto[];
}
