import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { MovimientosService } from 'src/movimientos/movimientos/movimientos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';

@Module({
  controllers: [VentasController],
  providers: [VentasService,MovimientosService],
  imports:[TypeOrmModule.forFeature([Venta])]
})
export class VentasModule {}
