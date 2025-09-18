import { Injectable } from '@nestjs/common';
import { CreateRemitoDto } from './dto/create-remito.dto';
import { UpdateRemitoDto } from './dto/update-remito.dto';

@Injectable()
export class RemitoService {
  create(createRemitoDto: CreateRemitoDto) {
    return 'This action adds a new remito';
  }

  findAll() {
    return `This action returns all remito`;
  }

  findOne(id: number) {
    return `This action returns a #${id} remito`;
  }

  update(id: number, updateRemitoDto: UpdateRemitoDto) {
    return `This action updates a #${id} remito`;
  }

  remove(id: number) {
    return `This action removes a #${id} remito`;
  }
}
