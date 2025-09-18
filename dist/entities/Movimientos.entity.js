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
exports.Movimientos = void 0;
const typeorm_1 = require("typeorm");
const Movimientos_Por_Producto_entity_1 = require("./Movimientos_Por_Producto.entity");
let Movimientos = class Movimientos {
};
exports.Movimientos = Movimientos;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "integer", name: "id" }),
    __metadata("design:type", Number)
], Movimientos.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "tipo", length: 30 }),
    __metadata("design:type", String)
], Movimientos.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Movimientos.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "" }),
    __metadata("design:type", String)
], Movimientos.prototype, "motivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "" }),
    __metadata("design:type", String)
], Movimientos.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Movimientos_Por_Producto_entity_1.Movimientos_Por_Producto, (mov_por_prod) => mov_por_prod),
    __metadata("design:type", Array)
], Movimientos.prototype, "movimientosPorProducto", void 0);
exports.Movimientos = Movimientos = __decorate([
    (0, typeorm_1.Entity)("movimientos", { schema: "public" })
], Movimientos);
//# sourceMappingURL=Movimientos.entity.js.map