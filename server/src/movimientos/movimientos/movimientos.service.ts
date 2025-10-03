import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Movimientos } from 'src/entities/Movimientos.entity';
import { Movimientos_Por_Producto } from 'src/entities/Movimientos_Por_Producto.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { Deposito } from 'src/depositos/entities/deposito.entity';
import { Producto_Por_Deposito } from 'src/entities/Producto_Por_Deposito.entity';

@Injectable()
export class MovimientosService {

  @InjectDataSource()
  private readonly dataSource: DataSource;

  async create(createMovimientoDto: CreateMovimientoDto) {
    const { tipo, observaciones, motivo, detalle } = createMovimientoDto
    const queryRunner = this.dataSource.createQueryRunner()
    const fecha = new Date();

    const f = new Date();
    const dd = f.getDate();
    const mm = f.getMonth() + 1;
    const yyyy = f.getFullYear();
    const fechaFormateada = `${dd}/${mm}/${yyyy}`;
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      const movimiento = queryRunner.manager.create(Movimientos, {
        fecha: fechaFormateada,
        tipo: tipo,
        motivo: motivo,
        observaciones: observaciones
      })
      await queryRunner.manager.save(movimiento)
      console.log(movimiento)
      for (const item of detalle) {
        const { cantidad, idDeposito, idProducto } = item;

        const producto = await queryRunner.manager.findOneBy(Producto, { id: idProducto });

        const detalle_movimiento = queryRunner.manager.create(Movimientos_Por_Producto, {
          productos: producto,
          cantidad,
          id_deposito: idDeposito,
          movimientos: movimiento,
        });
        await queryRunner.manager.save(detalle_movimiento);

        const { total_upd } = await queryRunner.manager
          .createQueryBuilder(Movimientos_Por_Producto, "mp")
          .select("COALESCE(SUM(mp.cantidad), 0)", "total_upd")
          .innerJoin(Movimientos, "m", "m.id = mp.movimientosId")
          .where("m.tipo = :tipo", { tipo: "UPD" })
          .andWhere("mp.productosId = :productoId", { productoId: idProducto })
          .andWhere("mp.id_deposito = :idDeposito", { idDeposito })
          .getRawOne();

        const { total_ins } = await queryRunner.manager
          .createQueryBuilder(Movimientos_Por_Producto, "mp")
          .select("COALESCE(SUM(mp.cantidad), 0)", "total_ins")
          .innerJoin(Movimientos, "m", "m.id = mp.movimientosId")
          .where("m.tipo = :tipo", { tipo: "INS" })
          .andWhere("mp.productosId = :productoId", { productoId: idProducto })
          .andWhere("mp.id_deposito = :idDeposito", { idDeposito })
          .getRawOne();


        const nuevoStock = Number(total_ins) + Number(total_upd);

        const dep = await queryRunner.manager.findOneBy(Deposito, { id_deposito: idDeposito });
        const prod = await queryRunner.manager.findOneBy(Producto, { id: idProducto });

        let ppd = await queryRunner.manager.findOne(Producto_Por_Deposito, {
          where: { producto: { id: idProducto }, deposito: { id_deposito: idDeposito } },
        });

        if (ppd) {
          ppd.stock = nuevoStock;
          await queryRunner.manager.save(ppd);
        } else {
          ppd = queryRunner.manager.create(Producto_Por_Deposito, {
            producto: prod,
            deposito: dep,
            stock: nuevoStock,
          });
          await queryRunner.manager.save(ppd);
        }
      }




      await queryRunner.commitTransaction()

    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException(error)
    } finally {
      await queryRunner.release()
    }

  }
}
