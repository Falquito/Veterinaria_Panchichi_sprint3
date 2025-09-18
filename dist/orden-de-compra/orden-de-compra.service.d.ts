import { CreateOrdenDeCompraDto } from './dto/create-orden-de-compra.dto';
import { OrdenDeCompra } from './entities/orden-de-compra.entity';
export declare class OrdenDeCompraService {
    private readonly logger;
    private readonly dataSource;
    private readonly ordenRepository;
    private readonly productoService;
    private readonly ordenProdRepository;
    create(createOrdenDeCompraDto: CreateOrdenDeCompraDto): Promise<OrdenDeCompra>;
    findAll(): Promise<OrdenDeCompra[]>;
    findOne(id: number): Promise<OrdenDeCompra>;
    private handleDbExceptions;
}
