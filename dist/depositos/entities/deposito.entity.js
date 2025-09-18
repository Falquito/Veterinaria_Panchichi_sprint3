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
exports.Deposito = void 0;
const Producto_Por_Deposito_entity_1 = require("../../entities/Producto_Por_Deposito.entity");
const typeorm_1 = require("typeorm");
let Deposito = class Deposito {
};
exports.Deposito = Deposito;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("identity"),
    __metadata("design:type", Number)
], Deposito.prototype, "id_deposito", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Deposito.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Deposito.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bool" }),
    __metadata("design:type", Boolean)
], Deposito.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Producto_Por_Deposito_entity_1.Producto_Por_Deposito, (prod_por_deposito) => prod_por_deposito.deposito),
    __metadata("design:type", Array)
], Deposito.prototype, "productosPorDeposito", void 0);
exports.Deposito = Deposito = __decorate([
    (0, typeorm_1.Entity)()
], Deposito);
//# sourceMappingURL=deposito.entity.js.map