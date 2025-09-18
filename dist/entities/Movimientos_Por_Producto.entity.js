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
exports.Movimientos_Por_Producto = void 0;
const typeorm_1 = require("typeorm");
const Movimientos_entity_1 = require("./Movimientos.entity");
const producto_entity_1 = require("../productos/entities/producto.entity");
let Movimientos_Por_Producto = class Movimientos_Por_Producto {
};
exports.Movimientos_Por_Producto = Movimientos_Por_Producto;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("identity"),
    __metadata("design:type", Number)
], Movimientos_Por_Producto.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], Movimientos_Por_Producto.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Movimientos_entity_1.Movimientos, (movimientos) => movimientos.movimientosPorProducto),
    __metadata("design:type", Movimientos_entity_1.Movimientos)
], Movimientos_Por_Producto.prototype, "movimientos", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => producto_entity_1.Producto, (producto) => producto.movimientosPorProducto),
    __metadata("design:type", producto_entity_1.Producto)
], Movimientos_Por_Producto.prototype, "productos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], Movimientos_Por_Producto.prototype, "id_deposito", void 0);
exports.Movimientos_Por_Producto = Movimientos_Por_Producto = __decorate([
    (0, typeorm_1.Entity)()
], Movimientos_Por_Producto);
//# sourceMappingURL=Movimientos_Por_Producto.entity.js.map