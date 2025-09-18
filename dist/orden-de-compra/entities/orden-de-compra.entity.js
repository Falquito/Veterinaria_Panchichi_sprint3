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
exports.OrdenDeCompra = void 0;
const Orden_de_compra_Por_Producto_entity_1 = require("../../entities/Orden_de_compra_Por_Producto.entity");
const proveedor_entity_1 = require("../../proveedores/entities/proveedor.entity");
const typeorm_1 = require("typeorm");
let OrdenDeCompra = class OrdenDeCompra {
};
exports.OrdenDeCompra = OrdenDeCompra;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("identity"),
    __metadata("design:type", Number)
], OrdenDeCompra.prototype, "id_oc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], OrdenDeCompra.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { default: 0 }),
    __metadata("design:type", Number)
], OrdenDeCompra.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Orden_de_compra_Por_Producto_entity_1.OrdenDeCompraPorProducto, o => o.ordenDeCompra, { cascade: true, eager: true }),
    __metadata("design:type", Array)
], OrdenDeCompra.prototype, "productos", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => proveedor_entity_1.Proveedor, proveedor => proveedor.ordenes, { eager: true }),
    __metadata("design:type", proveedor_entity_1.Proveedor)
], OrdenDeCompra.prototype, "proveedor", void 0);
exports.OrdenDeCompra = OrdenDeCompra = __decorate([
    (0, typeorm_1.Entity)()
], OrdenDeCompra);
//# sourceMappingURL=orden-de-compra.entity.js.map