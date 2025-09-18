import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
export declare class ProveedoresService {
    private readonly repo;
    private readonly logger;
    constructor(repo: Repository<Proveedor>);
    create(dto: CreateProveedorDto): Promise<Proveedor>;
    findAll(opts?: {
        q?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: Proveedor[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: number): Promise<Proveedor>;
    update(id: number, dto: UpdateProveedorDto): Promise<Proveedor>;
    remove(id: number): Promise<{
        message: string;
    }>;
    private handleDbExceptions;
}
