import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { DataSource, Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { MovimientosxLotexDeposito } from 'src/entities/MovimientosXLoteXDeposito.entity';
import { Lote } from 'src/lotes/entities/lote.entity';
import { LoteXDeposito } from 'src/entities/LoteXDeposito.entity';
import { DepositosService } from 'src/depositos/depositos.service';
import { Deposito } from '../depositos/entities/deposito.entity';

@Injectable()
export class ProductosService {
  @InjectDataSource()
  private readonly dataSource:DataSource
  private readonly logger = new Logger('ProductsService')
  @InjectRepository(Producto)
  private readonly productRepository:Repository<Producto>;
  @InjectRepository(Categoria)
  private readonly categoryRepository:Repository<Categoria>;
  @InjectRepository(MovimientosxLotexDeposito)
  private readonly movimientosRepository:Repository<MovimientosxLotexDeposito>;
  @InjectRepository(Lote)
  private readonly loteRepository:Repository<Lote>
  @Inject(DepositosService)
  private readonly depositoService:DepositosService;
  @InjectRepository(LoteXDeposito)
  private readonly lotexDepositoRepository:Repository<LoteXDeposito>;
  async create(createProductoDto: CreateProductoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { categoriaId, fechaelaboracion, fechaVencimiento, depositos, ...productDetails } =
        createProductoDto;
      // 1. Crear categoría y producto
      const categoria = await queryRunner.manager.findOneBy(Categoria, { id: categoriaId });
      const product = queryRunner.manager.create(Producto, { ...productDetails, categoria });
      await queryRunner.manager.save(product);
      // 2. Crear lote
      const lote = queryRunner.manager.create(Lote, {
        idProducto: product,
        fechaElaboracion: fechaelaboracion,
        fechaVencimiento: fechaVencimiento,
      });
      await queryRunner.manager.save(lote);
      // 3. Crear movimientos y registros en lote_x_deposito por cada depósito
      for (const dep of depositos) {
        const { IdDeposito, cantidad } = dep;
        // Movimiento INS
        const movimiento = queryRunner.manager.create(MovimientosxLotexDeposito, {
          id_producto: product.id,
          id_lote: lote.idLote,
          id_deposito: IdDeposito,
          tipo: 'INS',
          cantidad:""+cantidad,
        });
        await queryRunner.manager.save(movimiento);
        // Recalcular stock por producto+depósito
        const totalResult = await queryRunner.manager
          .createQueryBuilder(MovimientosxLotexDeposito, 'mov')
          .select('SUM(mov.cantidad)', 'total')
          .where('mov.tipo = :tipo', { tipo: 'INS' })
          .andWhere('mov.id_producto = :idProducto', { idProducto: product.id })
          .andWhere('mov.id_deposito = :idDeposito', { idDeposito: IdDeposito })
          .getRawOne();
        const total = parseInt(totalResult.total ?? 0);
        const deposito = await queryRunner.manager.findOneBy(Deposito, { id_deposito: IdDeposito });
        const loteXDeposito = queryRunner.manager.create(LoteXDeposito, {
          lote,
          deposito,
          stock: total,
        });
        await queryRunner.manager.save(loteXDeposito);
      }
      await queryRunner.commitTransaction();
      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDbExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }
  async findAll() {
    const rows = await this.dataSource.query(`
      SELECT 
        d.id_deposito   AS "idDeposito",
        d.nombre        AS "nombreDeposito",
        p.id            AS "idProducto",
        p.nombre        AS "nombreProducto",
        p.descripcion,
        p.precio,
        ld.stock
      FROM producto p
      JOIN lote l ON l.id_producto = p.id
      JOIN lote_x_deposito ld ON ld.id_lote = l.id_lote
      JOIN deposito d ON d.id_deposito = ld.id_deposito
      ORDER BY d.id_deposito, p.id;
    `);

    // agrupamos el resultado
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
  async findOne(id: number) {
    const rows = await this.dataSource.query(
      `
      SELECT 
        p.id            AS "idProducto",
        p.nombre        AS "nombreProducto",
        p.descripcion,
        p.precio,
        d.id_deposito   AS "idDeposito",
        d.nombre        AS "nombreDeposito",
        ld.stock
      FROM producto p
      JOIN lote l ON l.id_producto = p.id
      JOIN lote_x_deposito ld ON ld.id_lote = l.id_lote
      JOIN deposito d ON d.id_deposito = ld.id_deposito
      WHERE p.id = $1;
      `,
      [id],
    );
    if (rows.length === 0) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    // armamos el resultado agrupado
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
  async update(id: number, updateProductoDto: UpdateProductoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { categoriaId, depositos, ...productData } = updateProductoDto;
      // 1. Actualizar producto
      let categoria = null;
      if (categoriaId) {
        categoria = await queryRunner.manager.findOneBy(Categoria, { id: categoriaId });
      }
      const productUpdated = await queryRunner.manager.preload(Producto, {
        id,
        ...productData,
        ...(categoria ? { categoria } : {}),
      });
      await queryRunner.manager.save(productUpdated);
      // 2. Obtener lote(s) del producto
      const lotes = await queryRunner.manager.find(Lote, { where: { idProducto: { id } } });
      if (depositos && depositos.length > 0) {
        for (const dep of depositos) {
          const { IdDeposito, cantidad } = dep;
          for (const lote of lotes) {
            // Crear movimiento UPD
            await queryRunner.manager.save(MovimientosxLotexDeposito, {
              tipo: 'UPD',
              cantidad:""+cantidad,
              id_producto: id,
              id_lote: lote.idLote,
              id_deposito: IdDeposito,
            });
            // Recalcular stock total por producto+depósito
            const { total } = await queryRunner.manager
              .createQueryBuilder(MovimientosxLotexDeposito, 'mov')
              .select('SUM(mov.cantidad)', 'total')
              .where('mov.id_producto = :idProducto', { idProducto: id })
              .andWhere('mov.id_deposito = :idDeposito', { idDeposito: IdDeposito })
              .getRawOne();
            const stock = parseInt(total) || 0;
            const depositoEntity = await queryRunner.manager.findOneBy(Deposito, {
              id_deposito: IdDeposito,
            });
            // Actualizar o crear LoteXDeposito
            let loteXDep = await queryRunner.manager.findOne(LoteXDeposito, {
              where: { lote: { idLote: lote.idLote }, deposito: { id_deposito: IdDeposito } },
            });
            if (!loteXDep) {
              loteXDep = queryRunner.manager.create(LoteXDeposito, {
                lote,
                deposito: depositoEntity,
                stock,
              });
            } else {
              loteXDep.stock = stock;
            }
            await queryRunner.manager.save(loteXDep);
          }
        }
      }
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
  private handleDbExceptions (error:any){
    console.log(error)
    if(error.code==='23505'){
      throw new BadRequestException(error.detail)
    }
    this.logger.error(error)
    throw new InternalServerErrorException("Unexpected errir, check server logs")
  }
}
