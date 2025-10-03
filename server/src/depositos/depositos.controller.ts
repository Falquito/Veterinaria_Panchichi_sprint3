// server/src/depositos/depositos.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { DepositosService } from './depositos.service';
import { CreateDepositoDto } from './dto/create-deposito.dto';
import { UpdateDepositoDto } from './dto/update-deposito.dto';

@Controller('depositos')
export class DepositosController {
  constructor(private readonly depositosService: DepositosService) {}

  @Post()
  create(@Body() createDepositoDto: CreateDepositoDto) {
    return this.depositosService.create(createDepositoDto);
  }

  @Get()
  findAll() {
    return this.depositosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { // <-- CAMBIO AQUÍ
    return this.depositosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDepositoDto: UpdateDepositoDto) { // <-- CAMBIO AQUÍ
    return this.depositosService.update(id, updateDepositoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { // <-- CAMBIO AQUÍ
    return this.depositosService.remove(id);
  }
}