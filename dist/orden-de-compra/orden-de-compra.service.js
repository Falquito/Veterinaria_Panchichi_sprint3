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
exports.OrdenDeCompraService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const orden_de_compra_entity_1 = require("./entities/orden-de-compra.entity");
const typeorm_2 = require("@nestjs/typeorm");
const productos_service_1 = require("../productos/productos.service");
const Orden_de_compra_Por_Producto_entity_1 = require("../entities/Orden_de_compra_Por_Producto.entity");
const producto_entity_1 = require("../productos/entities/producto.entity");
const proveedor_entity_1 = require("../proveedores/entities/proveedor.entity");
let OrdenDeCompraService = class OrdenDeCompraService {
    constructor() {
        this.logger = new common_1.Logger('OrdenDeCompraService');
    }
    async create(createOrdenDeCompraDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const proveedor = await queryRunner.manager.findOneBy(proveedor_entity_1.Proveedor, { id_proveedor: createOrdenDeCompraDto.proveedorId });
            const fecha = new Date();
            const year = fecha.getFullYear() % 100;
            const month = fecha.getMonth() + 1;
            const day = fecha.getDate();
            const fechaFormateada = `${year.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const orden = queryRunner.manager.create(orden_de_compra_entity_1.OrdenDeCompra, { fecha: fechaFormateada, proveedor: proveedor });
            let total = 0;
            console.log(orden);
            orden.productos = [];
            for (const item of createOrdenDeCompraDto.productos) {
                const producto = await queryRunner.manager.findOneBy(producto_entity_1.Producto, { id: item.productoId });
                const ordenProducto = queryRunner.manager.create(Orden_de_compra_Por_Producto_entity_1.OrdenDeCompraPorProducto, {
                    producto,
                    cantidad: item.cantidad,
                });
                total += Number(producto.precio) * item.cantidad;
                orden.productos.push(ordenProducto);
            }
            orden.total = total;
            console.log(orden);
            await queryRunner.manager.save(orden);
            await queryRunner.commitTransaction();
            return orden;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.handleDbExceptions(error);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        return await this.ordenRepository.find();
    }
    async findOne(id) {
        const orden = await this.ordenRepository.findOneBy({ id_oc: id });
        if (orden) {
            return orden;
        }
        else {
            throw new common_1.NotFoundException("No se encontor la orden con el id: " + id);
        }
    }
    handleDbExceptions(error) {
        console.log(error);
        if (error.code === '42703') {
            this.logger.error("El error es: " + error.driverError + " te aconsejo: " + error.hint);
            throw new common_1.InternalServerErrorException("Error inesperado en el servidor, por favor revise los logs.");
        }
        this.logger.error(error);
        throw new common_1.InternalServerErrorException("Unexpected errir, check server logs");
    }
};
exports.OrdenDeCompraService = OrdenDeCompraService;
__decorate([
    (0, typeorm_2.InjectDataSource)(),
    __metadata("design:type", typeorm_1.DataSource)
], OrdenDeCompraService.prototype, "dataSource", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(orden_de_compra_entity_1.OrdenDeCompra),
    __metadata("design:type", typeorm_1.Repository)
], OrdenDeCompraService.prototype, "ordenRepository", void 0);
__decorate([
    (0, common_1.Inject)(productos_service_1.ProductosService),
    __metadata("design:type", productos_service_1.ProductosService)
], OrdenDeCompraService.prototype, "productoService", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(Orden_de_compra_Por_Producto_entity_1.OrdenDeCompraPorProducto),
    __metadata("design:type", typeorm_1.Repository)
], OrdenDeCompraService.prototype, "ordenProdRepository", void 0);
exports.OrdenDeCompraService = OrdenDeCompraService = __decorate([
    (0, common_1.Injectable)()
], OrdenDeCompraService);
//# sourceMappingURL=orden-de-compra.service.js.map