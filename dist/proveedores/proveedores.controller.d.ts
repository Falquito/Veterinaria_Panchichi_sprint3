import { ProveedoresService } from './proveedores.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
export declare class ProveedoresController {
    private readonly proveedoresService;
    constructor(proveedoresService: ProveedoresService);
    create(dto: CreateProveedorDto): Promise<import("./entities/proveedor.entity").Proveedor>;
    findAll(q?: string, page?: string, limit?: string): Promise<{
        items: import("./entities/proveedor.entity").Proveedor[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: string): Promise<import("./entities/proveedor.entity").Proveedor>;
    update(id: string, dto: UpdateProveedorDto): Promise<import("./entities/proveedor.entity").Proveedor>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
