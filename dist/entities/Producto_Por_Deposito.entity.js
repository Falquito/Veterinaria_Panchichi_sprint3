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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Producto_Por_Deposito = void 0;
const deposito_entity_1 = require("../depositos/entities/deposito.entity");
const producto_entity_1 = require("../productos/entities/producto.entity");
const typeorm_1 = require("typeorm");
let Producto_Por_Deposito = class Producto_Por_Deposito {
};
exports.Producto_Por_Deposito = Producto_Por_Deposito;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("identity"),
    __metadata("design:type", Number)
], Producto_Por_Deposito.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => producto_entity_1.Producto, (producto) => producto.productosPorDeposito),
    (0, typeorm_1.JoinColumn)({ name: "id_prod" }),
    __metadata("design:type", producto_entity_1.Producto)
], Producto_Por_Deposito.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => deposito_entity_1.Deposito, (deposito) => deposito.productosPorDeposito, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "id_deposito" }),
    __metadata("design:type", deposito_entity_1.Deposito)
], Producto_Por_Deposito.prototype, "deposito", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { nullable: false }),
    __metadata("design:type", Number)
], Producto_Por_Deposito.prototype, "stock", void 0);
exports.Producto_Por_Deposito = Producto_Por_Deposito = __decorate([
    (0, typeorm_1.Entity)()
], Producto_Por_Deposito);
//# sourceMappingURL=Producto_Por_Deposito.entity.js.map