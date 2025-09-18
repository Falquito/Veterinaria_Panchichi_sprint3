import { DepositosService } from './depositos.service';
import { CreateDepositoDto } from './dto/create-deposito.dto';
import { UpdateDepositoDto } from './dto/update-deposito.dto';
export declare class DepositosController {
    private readonly depositosService;
    constructor(depositosService: DepositosService);
    create(createDepositoDto: CreateDepositoDto): Promise<import("./entities/deposito.entity").Deposito>;
    findAll(): Promise<{
        items: import("./entities/deposito.entity").Deposito[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: string): Promise<import("./entities/deposito.entity").Deposito>;
    update(id: string, updateDepositoDto: UpdateDepositoDto): Promise<import("./entities/deposito.entity").Deposito>;
    remove(id: string): Promise<import("./entities/deposito.entity").Deposito>;
}
