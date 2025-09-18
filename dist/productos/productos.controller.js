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
exports.ProductosController = exports.MultipartValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const productos_service_1 = require("./productos.service");
const create_producto_dto_1 = require("./dto/create-producto.dto");
const update_producto_dto_1 = require("./dto/update-producto.dto");
const cloudinary_provider_1 = require("../providers/cloudinary/cloudinary.provider");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const platform_express_1 = require("@nestjs/platform-express");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_provider_1.default,
    params: {
        folder: 'productos',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});
class MultipartValidationPipe {
    constructor(dtoClass) {
        this.dtoClass = dtoClass;
    }
    transform(value, metadata) {
        if (metadata.type !== 'body')
            return value;
        if (value.depositos && typeof value.depositos === 'string') {
            try {
                value.depositos = JSON.parse(value.depositos);
            }
            catch {
                throw new common_1.BadRequestException('depositos must be a valid JSON array');
            }
        }
        if (value.precio)
            value.precio = Number(value.precio);
        if (value.categoriaId)
            value.categoriaId = Number(value.categoriaId);
        if (Array.isArray(value.depositos)) {
            value.depositos = value.depositos.map(d => (0, class_transformer_1.plainToInstance)(create_producto_dto_1.DepositoStockDto, d));
        }
        const dtoObject = (0, class_transformer_1.plainToInstance)(this.dtoClass, value);
        const errors = (0, class_validator_1.validateSync)(dtoObject, { whitelist: true, forbidNonWhitelisted: true });
        if (errors.length > 0) {
            const messages = errors.map(err => Object.values(err.constraints || {})).flat();
            throw new common_1.BadRequestException(messages);
        }
        return dtoObject;
    }
}
exports.MultipartValidationPipe = MultipartValidationPipe;
let ProductosController = class ProductosController {
    constructor(productosService) {
        this.productosService = productosService;
    }
    create(createProductoDto, file) {
        console.log(createProductoDto);
        return this.productosService.create(createProductoDto, file);
    }
    findAll() {
        return this.productosService.findAll();
    }
    findOne(id) {
        return this.productosService.findOne(+id);
    }
    update(id, updateProductoDto) {
        return this.productosService.update(+id, updateProductoDto);
    }
    remove(id) {
        return this.productosService.remove(+id);
    }
};
exports.ProductosController = ProductosController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen', { storage })),
    __param(0, (0, common_1.Body)(new MultipartValidationPipe(create_producto_dto_1.CreateProductoDto))),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_producto_dto_1.CreateProductoDto, Object]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_producto_dto_1.UpdateProductoDto]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "remove", null);
exports.ProductosController = ProductosController = __decorate([
    (0, common_1.Controller)('productos'),
    __metadata("design:paramtypes", [productos_service_1.ProductosService])
], ProductosController);
//# sourceMappingURL=productos.controller.js.map