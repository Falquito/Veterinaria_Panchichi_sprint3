import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';
export declare class ProductosService {
    private readonly dataSource;
    private readonly logger;
    private readonly productRepository;
    private readonly categoryRepository;
    create(createProductoDto: CreateProductoDto, file: Express.Multer.File): Promise<Producto>;
    findAll(): Promise<any>;
    findOne(id: number): Promise<{
        idProducto: any;
        nombre: any;
        descripcion: any;
        precio: any;
        depositos: any;
    }>;
    update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto>;
    remove(id: number): Promise<{
        message: string;
    }>;
    private handleDbExceptions;
}
