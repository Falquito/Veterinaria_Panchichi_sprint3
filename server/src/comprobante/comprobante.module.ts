import { Module } from '@nestjs/common';
import { ComprobanteService } from './comprobante.service';
import { ComprobanteController } from './comprobante.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comprobante } from './entities/comprobante.entity';

@Module({
  controllers: [ComprobanteController],
  providers: [ComprobanteService],
  imports:[TypeOrmModule.forFeature([Comprobante])]
})
export class ComprobanteModule {}
