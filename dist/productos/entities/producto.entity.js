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
exports.Producto = void 0;
const categoria_entity_1 = require("../../categorias/entities/categoria.entity");
const Movimientos_Por_Producto_entity_1 = require("../../entities/Movimientos_Por_Producto.entity");
const Orden_de_compra_Por_Producto_entity_1 = require("../../entities/Orden_de_compra_Por_Producto.entity");
const Producto_Por_Deposito_entity_1 = require("../../entities/Producto_Por_Deposito.entity");
const typeorm_1 = require("typeorm");
let Producto = class Producto {
};
exports.Producto = Producto;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("identity"),
    __metadata("design:type", Number)
], Producto.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Producto.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Producto.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "float" }),
    __metadata("design:type", Number)
], Producto.prototype, "precio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], Producto.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "" }),
    __metadata("design:type", String)
], Producto.prototype, "ImagenURL", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => categoria_entity_1.Categoria, (categoria) => categoria.productos, { eager: true }),
    __metadata("design:type", categoria_entity_1.Categoria)
], Producto.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Producto_Por_Deposito_entity_1.Producto_Por_Deposito, (prod_por_deposito) => prod_por_deposito.producto),
    __metadata("design:type", Array)
], Producto.prototype, "productosPorDeposito", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Producto.prototype, "fecha_vencimiento", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Generated)("increment"),
    __metadata("design:type", Number)
], Producto.prototype, "nro_lote", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Movimientos_Por_Producto_entity_1.Movimientos_Por_Producto, (mov_por_prod) => mov_por_prod.productos),
    __metadata("design:type", Array)
], Producto.prototype, "movimientosPorProducto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: () => "'[]'" }),
    __metadata("design:type", Array)
], Producto.prototype, "proveedoresId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Orden_de_compra_Por_Producto_entity_1.OrdenDeCompraPorProducto, o => o.producto),
    __metadata("design:type", Array)
], Producto.prototype, "ordenesPorProducto", void 0);
exports.Producto = Producto = __decorate([
    (0, typeorm_1.Entity)()
], Producto);
//# sourceMappingURL=producto.entity.js.map