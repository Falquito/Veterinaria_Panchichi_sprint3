"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const productos_module_1 = require("./productos/productos.module");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const categorias_module_1 = require("./categorias/categorias.module");
const depositos_module_1 = require("./depositos/depositos.module");
const orden_de_compra_module_1 = require("./orden-de-compra/orden-de-compra.module");
const proveedores_module_1 = require("./proveedores/proveedores.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [productos_module_1.ProductosModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DB_URL,
                ssl: {
                    rejectUnauthorized: false
                },
                autoLoadEntities: true,
                synchronize: true,
                entities: [
                    __dirname + '/**/*.entity{.ts,.js}'
                ]
            }),
            categorias_module_1.CategoriasModule,
            depositos_module_1.DepositosModule,
            orden_de_compra_module_1.OrdenDeCompraModule,
            proveedores_module_1.ProveedoresModule
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map