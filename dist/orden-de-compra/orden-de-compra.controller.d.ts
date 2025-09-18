import { OrdenDeCompraService } from './orden-de-compra.service';
import { CreateOrdenDeCompraDto } from './dto/create-orden-de-compra.dto';
export declare class OrdenDeCompraController {
    private readonly ordenDeCompraService;
    constructor(ordenDeCompraService: OrdenDeCompraService);
    create(createOrdenDeCompraDto: CreateOrdenDeCompraDto): Promise<import("./entities/orden-de-compra.entity").OrdenDeCompra>;
    findAll(): Promise<import("./entities/orden-de-compra.entity").OrdenDeCompra[]>;
    findOne(id: string): Promise<import("./entities/orden-de-compra.entity").OrdenDeCompra>;
}
