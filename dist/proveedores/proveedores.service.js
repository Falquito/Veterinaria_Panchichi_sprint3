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
exports.ProveedoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const proveedor_entity_1 = require("./entities/proveedor.entity");
let ProveedoresService = class ProveedoresService {
    constructor(repo) {
        this.repo = repo;
        this.logger = new common_1.Logger('ProveedoresService');
    }
    async create(dto) {
        try {
            const entity = this.repo.create(dto);
            return await this.repo.save(entity);
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async findAll(opts) {
        try {
            const page = Math.max(Number(opts?.page ?? 1), 1);
            const limit = Math.min(Math.max(Number(opts?.limit ?? 10), 1), 100);
            const where = [];
            if (opts?.q) {
                where.push({ nombre: (0, typeorm_2.ILike)(`%${opts.q}%`) });
                where.push({ cuit: (0, typeorm_2.ILike)(`%${opts.q}%`) });
                where.push({ email: (0, typeorm_2.ILike)(`%${opts.q}%`) });
            }
            const [items, total] = await this.repo.findAndCount({
                where: where.length ? where : undefined,
                order: { nombre: 'ASC' },
                skip: (page - 1) * limit,
                take: limit,
            });
            return { items, total, page, limit, pages: Math.ceil(total / limit) };
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async findOne(id) {
        try {
            const prov = await this.repo.findOne({ where: { id_proveedor: id } });
            if (!prov)
                throw new common_1.NotFoundException(`Proveedor con id ${id} no encontrado`);
            return prov;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            this.handleDbExceptions(error);
        }
    }
    async update(id, dto) {
        try {
            const prov = await this.repo.preload({ id_proveedor: id, ...dto });
            if (!prov)
                throw new common_1.NotFoundException(`Proveedor con id ${id} no encontrado`);
            return await this.repo.save(prov);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            this.handleDbExceptions(error);
        }
    }
    async remove(id) {
        try {
            const prov = await this.repo.findOne({ where: { id_proveedor: id } });
            if (!prov)
                throw new common_1.NotFoundException(`Proveedor con id ${id} no encontrado`);
            prov.activo = false;
            await this.repo.save(prov);
            return { message: `Proveedor con id ${id} desactivado correctamente` };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            this.handleDbExceptions(error);
        }
    }
    handleDbExceptions(error) {
        this.logger.error(error);
        throw new common_1.InternalServerErrorException('Error inesperado, revisa los logs del servidor.');
    }
};
exports.ProveedoresService = ProveedoresService;
exports.ProveedoresService = ProveedoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(proveedor_entity_1.Proveedor)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProveedoresService);
//# sourceMappingURL=proveedores.service.js.map