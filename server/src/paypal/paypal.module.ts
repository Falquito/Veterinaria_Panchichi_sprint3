import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { HttpModule } from '@nestjs/axios';
import { VentasService } from 'src/ventas/ventas.service';
import { MovimientosService } from 'src/movimientos/movimientos/movimientos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from 'src/ventas/entities/venta.entity';

@Module({
  controllers: [PaypalController],
  providers: [PaypalService,VentasService,MovimientosService],
  imports:[HttpModule,TypeOrmModule.forFeature([Venta])]
})
export class PaypalModule {}
