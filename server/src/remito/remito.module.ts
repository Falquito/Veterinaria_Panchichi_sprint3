import { Module } from '@nestjs/common';
import { RemitoController } from './remito.controller';
import { RemitoService } from './remito.service';

@Module({
  controllers: [RemitoController],
  providers: [RemitoService]
})
export class RemitoModule {}
