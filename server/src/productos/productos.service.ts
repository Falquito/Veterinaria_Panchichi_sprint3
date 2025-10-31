import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { DataSource, Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { DepositosService } from 'src/depositos/depositos.service';
import { Deposito } from '../depositos/entities/deposito.entity';
import { Movimientos } from 'src/entities/Movimientos.entity';
import { Movimientos_Por_Producto } from 'src/entities/Movimientos_Por_Producto.entity';
import { Producto_Por_Deposito } from 'src/entities/Producto_Por_Deposito.entity';

@Injectable()
export class ProductosService {
  @InjectDataSource()
  private readonly dataSource:DataSource
  private readonly logger = new Logger('ProductsService')
  @InjectRepository(Producto)
  private readonly productRepository:Repository<Producto>;
  @InjectRepository(Categoria)
  private readonly categoryRepository:Repository<Categoria>;

  
  async create(createProductoDto: CreateProductoDto,file:Express.Multer.File) {
    const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                const { categoriaId, fechaelaboracion, fechaVencimiento, depositos,proveedoresId, ...productDetails } = createProductoDto;
                const categoria = await queryRunner.manager.findOneBy(Categoria, { id: categoriaId });
                const product = queryRunner.manager.create(Producto, { ...productDetails,proveedoresIds:proveedoresId, categoria, ImagenURL: file?.path, fecha_vencimiento: fechaVencimiento });
                await queryRunner.manager.save(product);
                const movimientoPrincipal = queryRunner.manager.create(Movimientos, {
                    tipo: "INS",
                    fecha: "",
                    motivo: "",
                    observaciones: ""
                });
                await queryRunner.manager.save(movimientoPrincipal);
                for (const dep of depositos) {
                    const { IdDeposito, cantidad } = dep;
                    const movimiento = queryRunner.manager.create(Movimientos_Por_Producto, {
                        productos: product,
                        movimientos: movimientoPrincipal,
                        cantidad: cantidad,
                        id_deposito: IdDeposito
                    });
                    await queryRunner.manager.save(movimiento);
                    const totalResult = await queryRunner.manager
                        .createQueryBuilder(Movimientos_Por_Producto, 'mov')
                        .select('SUM(mov.cantidad)', 'total')
                        .innerJoin(Movimientos, "movimientos", "movimientos.id=mov.movimientosId")
                        .where("movimientos.tipo = :tipo", { tipo: "INS" })
                        .andWhere('mov.productosId = :idProducto', { idProducto: product.id })
                        .andWhere('mov.id_deposito = :idDeposito', { idDeposito: IdDeposito })
                        .getRawOne();
                    const total = parseInt(totalResult.total ?? 0);
                    const deposito = await queryRunner.manager.findOneBy(Deposito, { id_deposito: IdDeposito });
                    const productoXDeposito = queryRunner.manager.create(Producto_Por_Deposito, {
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
        p."ImagenURL",  -- 1. AÑADIR AQUÍ (con comillas dobles)
        c.nombre        AS "nombreCategoria",
        p.fecha_vencimiento,
        pd.stock
      FROM producto p
      JOIN producto_por_deposito pd ON pd.id_prod = p.id
      JOIN deposito d ON d.id_deposito = pd.id_deposito
      LEFT JOIN categoria c ON c.id = p."categoriaId"
      WHERE CAST(p.fecha_vencimiento AS date) > CURRENT_DATE
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
                    nombreCategoria: row.nombreCategoria,
                    fecha_vencimiento:row.fecha_vencimiento,
                    ImagenURL: row.ImagenURL // 2. AÑADIR AQUÍ
                });
                return acc;
            }, []);
            return result;
        }
        catch (error) {
            this.handleDbExceptions(error);
        }
  }

  async findAllList(){
    return this.productRepository.find()
  }
  async findOne(id: number) {
    let bandera = false;
            try {
         const rows = await this.dataSource.query(`
  SELECT 
    p.id              AS "idProducto",
    p.nombre          AS "nombreProducto",
    p.descripcion,
    p.precio,
    d.id_deposito     AS "idDeposito",
    d.nombre          AS "nombreDeposito",
    pd.stock,
    p."categoriaId"   AS "categoriaId",   -- <== COMILLAS
    c.nombre          AS "nombreCategoria",
    p.fecha_vencimiento
  FROM producto p
  JOIN producto_por_deposito pd ON pd.id_prod = p.id
  JOIN deposito d ON d.id_deposito = pd.id_deposito
  LEFT JOIN categoria c ON c.id = p."categoriaId"
  WHERE p.id = $1
    AND (p.fecha_vencimiento IS NULL OR CAST(p.fecha_vencimiento AS date) > CURRENT_DATE);
`, [id]);
                if (rows.length === 0) {
                    bandera = true;
                }
                const producto = {
                    idProducto: rows[0].idProducto,
                    nombre: rows[0].nombreProducto,
                    descripcion: rows[0].descripcion,
                    precio: rows[0].precio,
                    fecha_vencimiento:rows[0].fecha_vencimiento,
                    nombreCategoria: rows[0].nombreCategoria,
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
                    throw new NotFoundException(`Producto con id ${id} no encontrado`);
                }
                else {
                    this.handleDbExceptions(error);
                }
            }
  }
async update(id: number, updateProductoDto: UpdateProductoDto, file?: Express.Multer.File) {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { categoriaId, depositos, ...productData } = updateProductoDto;
    const depositosList = Array.isArray(depositos) ? depositos : [];

    let categoria = null;
    if (categoriaId) {
      categoria = await queryRunner.manager.findOneBy(Categoria, { id: categoriaId });
    }

    const productUpdated = await queryRunner.manager.preload(Producto, {
      id,
      ...productData,
      ...(categoria ? { categoria } : {}),
      ...(file ? { ImagenURL: file.path } : {}), // ✅ Guarda la nueva imagen
    });

    await queryRunner.manager.save(productUpdated);

    // ... (mantener tu lógica de stock)
    await queryRunner.commitTransaction();
    return productUpdated;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    this.handleDbExceptions(error);
  } finally {
    await queryRunner.release();
  }
}


  async remove(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    product.activo=false
    await this.productRepository.save(product);
    return { message: `Producto con id ${id} eliminado correctamente` };
  }
  async restore(id: number) {
    const result = await this.productRepository.update({ id }, { activo: true });
    if (!result.affected)
      throw new NotFoundException(`Producto ${id} no encontrado`);
    return { message: `Producto ${id} restaurado` };
  }

  private handleDbExceptions (error:any){
    console.log(error);
            if (error.code === '42703') {
                this.logger.error("El error es: " + error.driverError + " te aconsejo: " + error.hint);
                throw new InternalServerErrorException("Error inesperado en el servidor, por favor revise los logs.");
            }
            this.logger.error(error);
            throw new InternalServerErrorException("Unexpected errir, check server logs");
  }
}
