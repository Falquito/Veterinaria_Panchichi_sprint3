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
    private readonly dataSource:DataSource;

    async create (createMovimientoDto:CreateMovimientoDto){
        const {tipo,observaciones,motivo,fecha,detalle}= createMovimientoDto
        const queryRunner = this.dataSource.createQueryRunner()
        try {

            await queryRunner.connect()
            await queryRunner.startTransaction()

            const movimiento = queryRunner.manager.create(Movimientos,{
                fecha:fecha,
                tipo:tipo,
                motivo:motivo,
                observaciones:observaciones
            })
            await queryRunner.manager.save(movimiento)
            console.log(movimiento)
            for (const item of detalle){
                const {cantidad,idDeposito,idProducto} = item
                const producto = await queryRunner.manager.findOneBy(Producto,{id:idProducto})
                const detalle_movimiento = queryRunner.manager.create(Movimientos_Por_Producto,{
                    productos:producto,
                    cantidad:cantidad,
                    id_deposito:idDeposito,
                    movimientos:movimiento
                })
                console.log(detalle_movimiento)
                await queryRunner.manager.save(detalle_movimiento)

                const { total } = await queryRunner.manager.createQueryBuilder(Movimientos_Por_Producto, "mp")
                .select("sum(cantidad)", "total")
                .innerJoin(Movimientos, "m", "m.id = mp.movimientosId")
                .where("m.tipo = :tipo", { tipo: "UPD" })
                .andWhere("mp.productosId = :productoId", { productoId: idProducto })
                .andWhere("mp.id_deposito = :idDeposito", { idDeposito: idDeposito })
                .getRawOne();
                const { totall } = await queryRunner.manager.createQueryBuilder(Movimientos_Por_Producto, "mp")
                .select("sum(cantidad)", "totall")
                .innerJoin(Movimientos, "m", "m.id = mp.movimientosId")
                .where("m.tipo = :tipo", { tipo: "INS" })
                .andWhere("mp.productosId = :productosId", { productosId: idProducto })
                .andWhere("mp.id_deposito = id_deposito", { id_deposito: idDeposito })
                .getRawOne();
                console.log(total, totall);
                const depId = await queryRunner.manager.findOneBy(Deposito, { id_deposito: idDeposito });
                const productId = await queryRunner.manager.findOneBy(Producto, { id: idProducto });
                let prodPorDeposito = await queryRunner.manager.findOne(Producto_Por_Deposito, {
                    where: {
                            producto: { id:idProducto },
                            deposito: { id_deposito: idDeposito},
                            },
                });
                const prod_por_depositoUpdated = await queryRunner.manager.preload(Producto_Por_Deposito, {
                        id: prodPorDeposito.id,
                        deposito: depId,
                        stock: +totall + parseInt(total),
                        producto: productId
                });
                await queryRunner.manager.save(prod_por_depositoUpdated);
            }

            

            await queryRunner.commitTransaction()
            
        } catch (error) {
            await queryRunner.rollbackTransaction() 
            throw new InternalServerErrorException(error)
        }finally{
            await queryRunner.release()
        }
        
    }
}
