import { Module } from '@nestjs/common';
import { OrdenDePagoService } from './orden-de-pago.service';
import { OrdenDePagoController } from './orden-de-pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenDePago } from './entities/orden-de-pago.entity';

@Module({
  imports:[TypeOrmModule.forFeature([OrdenDePago])],
  controllers: [OrdenDePagoController],
  providers: [OrdenDePagoService],
})
export class OrdenDePagoModule {}
