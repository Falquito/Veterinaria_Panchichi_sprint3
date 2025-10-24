import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { MovimientosService } from 'src/movimientos/movimientos/movimientos.service';

@Module({
  controllers: [VentasController],
  providers: [VentasService,MovimientosService],
  imports:[]
})
export class VentasModule {}
