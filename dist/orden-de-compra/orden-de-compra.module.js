"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdenDeCompraModule = void 0;
const common_1 = require("@nestjs/common");
const orden_de_compra_service_1 = require("./orden-de-compra.service");
const orden_de_compra_controller_1 = require("./orden-de-compra.controller");
const productos_service_1 = require("../productos/productos.service");
const typeorm_1 = require("@nestjs/typeorm");
const orden_de_compra_entity_1 = require("./entities/orden-de-compra.entity");
const Orden_de_compra_Por_Producto_entity_1 = require("../entities/Orden_de_compra_Por_Producto.entity");
const producto_entity_1 = require("../productos/entities/producto.entity");
const categoria_entity_1 = require("../categorias/entities/categoria.entity");
const proveedor_entity_1 = require("../proveedores/entities/proveedor.entity");
let OrdenDeCompraModule = class OrdenDeCompraModule {
};
exports.OrdenDeCompraModule = OrdenDeCompraModule;
exports.OrdenDeCompraModule = OrdenDeCompraModule = __decorate([
    (0, common_1.Module)({
        controllers: [orden_de_compra_controller_1.OrdenDeCompraController],
        providers: [orden_de_compra_service_1.OrdenDeCompraService, productos_service_1.ProductosService],
        imports: [typeorm_1.TypeOrmModule.forFeature([orden_de_compra_entity_1.OrdenDeCompra, Orden_de_compra_Por_Producto_entity_1.OrdenDeCompraPorProducto, producto_entity_1.Producto, categoria_entity_1.Categoria, proveedor_entity_1.Proveedor])]
    })
], OrdenDeCompraModule);
//# sourceMappingURL=orden-de-compra.module.js.map