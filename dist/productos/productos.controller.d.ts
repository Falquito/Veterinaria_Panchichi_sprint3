import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
export declare class MultipartValidationPipe implements PipeTransform {
    private readonly dtoClass;
    constructor(dtoClass: any);
    transform(value: any, metadata: ArgumentMetadata): any;
}
export declare class ProductosController {
    private readonly productosService;
    constructor(productosService: ProductosService);
    create(createProductoDto: CreateProductoDto, file: Express.Multer.File): Promise<import("./entities/producto.entity").Producto>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<{
        idProducto: any;
        nombre: any;
        descripcion: any;
        precio: any;
        depositos: any;
    }>;
    update(id: string, updateProductoDto: UpdateProductoDto): Promise<import("./entities/producto.entity").Producto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
