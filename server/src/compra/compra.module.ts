import { Module } from '@nestjs/common';
import { CompraService } from './compra.service';
import { CompraController } from './compra.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Remito } from './entities/compra.entity';

@Module({
  controllers: [CompraController],
  providers: [CompraService],
  imports:[TypeOrmModule.forFeature([Remito])]
})
export class CompraModule {}
