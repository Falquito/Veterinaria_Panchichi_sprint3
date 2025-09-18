import { Module } from '@nestjs/common';
import { RemitoService } from './remito.service';
import { RemitoController } from './remito.controller';

@Module({
  controllers: [RemitoController],
  providers: [RemitoService],
})
export class RemitoModule {}
