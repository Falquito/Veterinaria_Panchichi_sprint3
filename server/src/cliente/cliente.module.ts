import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clientes } from 'src/entities/Cliente.entity';

@Module({
  controllers: [ClienteController],
  providers: [ClienteService],
  imports:[TypeOrmModule.forFeature([Clientes])]
})
export class ClienteModule {}
