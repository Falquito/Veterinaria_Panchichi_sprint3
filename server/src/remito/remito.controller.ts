import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RemitoService } from './remito.service';
import { CreateRemitoDto } from './dto/create-remito.dto';
import { UpdateRemitoDto } from './dto/update-remito.dto';

@Controller('remito')
export class RemitoController {
  constructor(private readonly remitoService: RemitoService) {}

  @Post()
  create(@Body() createRemitoDto: CreateRemitoDto) {
    return this.remitoService.create(createRemitoDto);
  }

  @Get()
  findAll() {
    return this.remitoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.remitoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRemitoDto: UpdateRemitoDto) {
    return this.remitoService.update(+id, updateRemitoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.remitoService.remove(+id);
  }
}
