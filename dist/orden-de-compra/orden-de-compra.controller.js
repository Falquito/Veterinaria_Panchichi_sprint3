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
exports.OrdenDeCompraController = void 0;
const common_1 = require("@nestjs/common");
const orden_de_compra_service_1 = require("./orden-de-compra.service");
const create_orden_de_compra_dto_1 = require("./dto/create-orden-de-compra.dto");
let OrdenDeCompraController = class OrdenDeCompraController {
    constructor(ordenDeCompraService) {
        this.ordenDeCompraService = ordenDeCompraService;
    }
    create(createOrdenDeCompraDto) {
        return this.ordenDeCompraService.create(createOrdenDeCompraDto);
    }
    findAll() {
        return this.ordenDeCompraService.findAll();
    }
    findOne(id) {
        return this.ordenDeCompraService.findOne(+id);
    }
};
exports.OrdenDeCompraController = OrdenDeCompraController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_orden_de_compra_dto_1.CreateOrdenDeCompraDto]),
    __metadata("design:returntype", void 0)
], OrdenDeCompraController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdenDeCompraController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdenDeCompraController.prototype, "findOne", null);
exports.OrdenDeCompraController = OrdenDeCompraController = __decorate([
    (0, common_1.Controller)('orden-de-compra'),
    __metadata("design:paramtypes", [orden_de_compra_service_1.OrdenDeCompraService])
], OrdenDeCompraController);
//# sourceMappingURL=orden-de-compra.controller.js.map