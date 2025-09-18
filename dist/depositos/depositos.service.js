"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const deposito_entity_1 = require("./entities/deposito.entity");
let DepositosService = class DepositosService {
    constructor(repo) {
        this.repo = repo;
    }
    async create(dto) {
        const entity = this.repo.create(dto);
        return this.repo.save(entity);
    }
    async findAll(opts) {
        const page = Math.max(Number(opts?.page ?? 1), 1);
        const limit = Math.min(Math.max(Number(opts?.limit ?? 10), 1), 100);
        const where = [];
        if (opts?.q) {
            where.push({ nombre: (0, typeorm_2.ILike)(`%${opts.q}%`) });
            where.push({ direccion: (0, typeorm_2.ILike)(`%${opts.q}%`) });
        }
        const [items, total] = await this.repo.findAndCount({
            where: where.length ? where : undefined,
            order: { nombre: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            items,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const dep = await this.repo.findOneBy({ id_deposito: +id });
        if (!dep)
            throw new common_1.NotFoundException('Depósito no encontrado');
        return dep;
    }
    async update(id, dto) {
        const dep = await this.findOne(id);
        Object.assign(dep, dto);
        return this.repo.save(dep);
    }
    async remove(id) {
        const dep = await this.findOne(id);
        dep.activo = false;
        return await this.repo.save(dep);
        ;
    }
};
exports.DepositosService = DepositosService;
exports.DepositosService = DepositosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(deposito_entity_1.Deposito)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DepositosService);
//# sourceMappingURL=depositos.service.js.map