import { Repository } from 'typeorm';
import { Deposito } from './entities/deposito.entity';
import { CreateDepositoDto } from './dto/create-deposito.dto';
import { UpdateDepositoDto } from './dto/update-deposito.dto';
export declare class DepositosService {
    private readonly repo;
    constructor(repo: Repository<Deposito>);
    create(dto: CreateDepositoDto): Promise<Deposito>;
    findAll(opts?: {
        q?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: Deposito[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: string): Promise<Deposito>;
    update(id: string, dto: UpdateDepositoDto): Promise<Deposito>;
    remove(id: string): Promise<Deposito>;
}
