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
exports.CategoriasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const categoria_entity_1 = require("./entities/categoria.entity");
let CategoriasService = class CategoriasService {
    constructor(categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }
    async create(createCategoriaDto) {
        try {
            const existingCategoria = await this.categoriaRepository.findOne({
                where: { nombre: createCategoriaDto.nombre }
            });
            if (existingCategoria) {
                throw new common_1.ConflictException('Ya existe una categoría con ese nombre');
            }
            const categoria = this.categoriaRepository.create(createCategoriaDto);
            return await this.categoriaRepository.save(categoria);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Error al crear la categoría: ${error.message}`);
        }
    }
    async findAll() {
        return await this.categoriaRepository.find({
            order: { nombre: 'ASC' }
        });
    }
    async findOne(id) {
        const categoria = await this.categoriaRepository.findOne({
            where: { id }
        });
        if (!categoria) {
            throw new common_1.NotFoundException(`Categoría con ID ${id} no encontrada`);
        }
        return categoria;
    }
    async update(id, updateCategoriaDto) {
        const categoria = await this.findOne(id);
        if (updateCategoriaDto.nombre && updateCategoriaDto.nombre !== categoria.nombre) {
            const existingCategoria = await this.categoriaRepository.findOne({
                where: { nombre: updateCategoriaDto.nombre }
            });
            if (existingCategoria) {
                throw new common_1.ConflictException('Ya existe una categoría con ese nombre');
            }
        }
        Object.assign(categoria, updateCategoriaDto);
        return await this.categoriaRepository.save(categoria);
    }
    async remove(id) {
        const categoria = await this.findOne(id);
        categoria.activo = false;
        return await this.categoriaRepository.save(categoria);
    }
    async findByNombre(nombre) {
        return await this.categoriaRepository.findOne({
            where: { nombre }
        });
    }
};
exports.CategoriasService = CategoriasService;
exports.CategoriasService = CategoriasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(categoria_entity_1.Categoria)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriasService);
//# sourceMappingURL=categorias.service.js.map