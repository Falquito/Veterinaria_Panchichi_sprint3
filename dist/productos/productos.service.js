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
exports.ProductosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const producto_entity_1 = require("./entities/producto.entity");
const typeorm_2 = require("@nestjs/typeorm");
const categoria_entity_1 = require("../categorias/entities/categoria.entity");
const deposito_entity_1 = require("../depositos/entities/deposito.entity");
const Movimientos_entity_1 = require("../entities/Movimientos.entity");
const Movimientos_Por_Producto_entity_1 = require("../entities/Movimientos_Por_Producto.entity");
const Producto_Por_Deposito_entity_1 = require("../entities/Producto_Por_Deposito.entity");
let ProductosService = class ProductosService {
    constructor() {
        this.logger = new common_1.Logger('ProductsService');
    }
    async create(createProductoDto, file) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { categoriaId, fechaelaboracion, fechaVencimiento, depositos, proveedoresId, ...productDetails } = createProductoDto;
            const categoria = await queryRunner.manager.findOneBy(categoria_entity_1.Categoria, { id: categoriaId });
            const product = queryRunner.manager.create(producto_entity_1.Producto, { ...productDetails, proveedoresIds: proveedoresId, categoria, ImagenURL: file?.path, fecha_vencimiento: fechaVencimiento });
            await queryRunner.manager.save(product);
            const movimientoPrincipal = queryRunner.manager.create(Movimientos_entity_1.Movimientos, {
                tipo: "INS",
                fecha: "",
                motivo: "",
                observaciones: ""
            });
            await queryRunner.manager.save(movimientoPrincipal);
            for (const dep of depositos) {
                const { IdDeposito, cantidad } = dep;
                const movimiento = queryRunner.manager.create(Movimientos_Por_Producto_entity_1.Movimientos_Por_Producto, {
                    productos: product,
                    movimientos: movimientoPrincipal,
                    cantidad: cantidad,
                    id_deposito: IdDeposito
                });
                await queryRunner.manager.save(movimiento);
                const totalResult = await queryRunner.manager
                    .createQueryBuilder(Movimientos_Por_Producto_entity_1.Movimientos_Por_Producto, 'mov')
                    .select('SUM(mov.cantidad)', 'total')
                    .innerJoin(Movimientos_entity_1.Movimientos, "movimientos", "movimientos.id=mov.movimientosId")
                    .where("movimientos.tipo = :tipo", { tipo: "INS" })
                    .andWhere('mov.productosId = :idProducto', { idProducto: product.id })
                    .andWhere('mov.id_deposito = :idDeposito', { idDeposito: IdDeposito })
                    .getRawOne();
                const total = parseInt(totalResult.total ?? 0);
                const deposito = await queryRunner.manager.findOneBy(deposito_entity_1.Deposito, { id_deposito: IdDeposito });
                const productoXDeposito = queryRunner.manager.create(Producto_Por_Deposito_entity_1.Producto_Por_Deposito, {
                    producto: product,
                    deposito: deposito,
                    stock: total,
                });
                await queryRunner.manager.save(productoXDeposito);
            }
            await queryRunner.commitTransaction();
            return product;
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
        try {
            const rows = await this.dataSource.query(`
      SELECT 
        d.id_deposito   AS "idDeposito",
        d.nombre        AS "nombreDeposito",
        p.id            AS "idProducto",
        p.nombre        AS "nombreProducto",
        p.descripcion,
        p.precio,
        pd.stock
      FROM producto p
      JOIN producto_por_deposito pd ON pd.id_prod = p.id
      JOIN deposito d ON d.id_deposito = pd.id_deposito
      ORDER BY d.id_deposito, p.id;
    `);
            const result = rows.reduce((acc, row) => {
                let deposito = acc.find((d) => d.idDeposito === row.idDeposito);
                if (!deposito) {
                    deposito = {
                        idDeposito: row.idDeposito,
                        nombreDeposito: row.nombreDeposito,
                        productos: [],
                    };
                    acc.push(deposito);
                }
                deposito.productos.push({
                    id: row.idProducto,
                    nombre: row.nombreProducto,
                    descripcion: row.descripcion,
                    precio: row.precio,
                    stock: row.stock,
                });
                return acc;
            }, []);
            return result;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
    }
    async findOne(id) {
        let bandera = false;
        try {
            const rows = await this.dataSource.query(`
          SELECT 
            p.id            AS "idProducto",
            p.nombre        AS "nombreProducto",
            p.descripcion,
            p.precio,
            d.id_deposito   AS "idDeposito",
            d.nombre        AS "nombreDeposito",
            pd.stock
          FROM producto p
          JOIN producto_por_deposito pd ON pd.id_prod = p.id
          JOIN deposito d ON d.id_deposito = pd.id_deposito
          WHERE p.id = $1;
          `, [id]);
            if (rows.length === 0) {
                bandera = true;
            }
            const producto = {
                idProducto: rows[0].idProducto,
                nombre: rows[0].nombreProducto,
                descripcion: rows[0].descripcion,
                precio: rows[0].precio,
                depositos: rows.map((row) => ({
                    idDeposito: row.idDeposito,
                    nombreDeposito: row.nombreDeposito,
                    stock: row.stock,
                })),
            };
            return producto;
        }
        catch (error) {
            if (bandera) {
                throw new common_1.NotFoundException(`Producto con id ${id} no encontrado`);
            }
            else {
                this.handleDbExceptions(error);
            }
        }
    }
    async update(id, updateProductoDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { categoriaId, depositos, ...productData } = updateProductoDto;
            let categoria = null;
            if (categoriaId) {
                categoria = await queryRunner.manager.findOneBy(categoria_entity_1.Categoria, { id: categoriaId });
            }
            const productUpdated = await queryRunner.manager.preload(producto_entity_1.Producto, {
                id,
                ...productData,
                ...(categoria ? { categoria } : {}),
            });
            await queryRunner.manager.save(productUpdated);
            const movimiento = queryRunner.manager.create(Movimientos_entity_1.Movimientos, {
                tipo: "UPD",
                fecha: "",
                motivo: "",
                observaciones: "",
                id_producto: id,
            });
            await queryRunner.manager.save(movimiento);
            for (const dep of depositos) {
                const mov_por_prod = queryRunner.manager.create(Movimientos_Por_Producto_entity_1.Movimientos_Por_Producto, {
                    cantidad: dep.cantidad,
                    movimientos: movimiento,
                    productos: productUpdated,
                    id_deposito: dep.IdDeposito
                });
                await queryRunner.manager.save(mov_por_prod);
                const { total } = await queryRunner.manager.createQueryBuilder(Movimientos_Por_Producto_entity_1.Movimientos_Por_Producto, "mp")
                    .select("sum(cantidad)", "total")
                    .innerJoin(Movimientos_entity_1.Movimientos, "m", "m.id = mp.movimientosId")
                    .where("m.tipo = :tipo", { tipo: "UPD" })
                    .andWhere("mp.productosId = :productoId", { productoId: id })
                    .andWhere("mp.id_deposito = :idDeposito", { idDeposito: dep.IdDeposito })
                    .getRawOne();
                const { totall } = await queryRunner.manager.createQueryBuilder(Movimientos_Por_Producto_entity_1.Movimientos_Por_Producto, "mp")
                    .select("sum(cantidad)", "totall")
                    .innerJoin(Movimientos_entity_1.Movimientos, "m", "m.id = mp.movimientosId")
                    .where("m.tipo = :tipo", { tipo: "INS" })
                    .andWhere("mp.productosId = :productosId", { productosId: id })
                    .andWhere("mp.id_deposito = id_deposito", { id_deposito: dep.IdDeposito })
                    .getRawOne();
                console.log(total, totall);
                const depId = await queryRunner.manager.findOneBy(deposito_entity_1.Deposito, { id_deposito: dep.IdDeposito });
                const productId = await queryRunner.manager.findOneBy(producto_entity_1.Producto, { id: id });
                let prodPorDeposito = await queryRunner.manager.findOne(Producto_Por_Deposito_entity_1.Producto_Por_Deposito, {
                    where: {
                        producto: { id },
                        deposito: { id_deposito: dep.IdDeposito },
                    },
                });
                const prod_por_depositoUpdated = await queryRunner.manager.preload(Producto_Por_Deposito_entity_1.Producto_Por_Deposito, {
                    id: prodPorDeposito.id,
                    deposito: depId,
                    stock: +totall + parseInt(total),
                    producto: productId
                });
                await queryRunner.manager.save(prod_por_depositoUpdated);
            }
            await queryRunner.commitTransaction();
            return productUpdated;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.handleDbExceptions(error);
        }
        finally {
            await queryRunner.release();
        }
    }
    async remove(id) {
        const product = await this.productRepository.findOneBy({ id });
        if (!product) {
            throw new common_1.NotFoundException(`Producto con id ${id} no encontrado`);
        }
        product.activo = false;
        await this.productRepository.save(product);
        return { message: `Producto con id ${id} eliminado correctamente` };
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
exports.ProductosService = ProductosService;
__decorate([
    (0, typeorm_2.InjectDataSource)(),
    __metadata("design:type", typeorm_1.DataSource)
], ProductosService.prototype, "dataSource", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(producto_entity_1.Producto),
    __metadata("design:type", typeorm_1.Repository)
], ProductosService.prototype, "productRepository", void 0);
__decorate([
    (0, typeorm_2.InjectRepository)(categoria_entity_1.Categoria),
    __metadata("design:type", typeorm_1.Repository)
], ProductosService.prototype, "categoryRepository", void 0);
exports.ProductosService = ProductosService = __decorate([
    (0, common_1.Injectable)()
], ProductosService);
//# sourceMappingURL=productos.service.js.map