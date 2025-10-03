// server/src/orden-de-compra/orden-de-compra.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common'; // 1. Importar ParseIntPipe
import { OrdenDeCompraService } from './orden-de-compra.service';
import { CreateOrdenDeCompraDto } from './dto/create-orden-de-compra.dto';

@Controller('orden-de-compra')
export class OrdenDeCompraController {
  constructor(private readonly ordenDeCompraService: OrdenDeCompraService) {}

  @Post()
  create(@Body() createOrdenDeCompraDto: CreateOrdenDeCompraDto) {
    return this.ordenDeCompraService.create(createOrdenDeCompraDto);
  }

  @Get()
  findAll() {
    return this.ordenDeCompraService.findAll();
  }
  
  @Get('available-for-remito')
  findAvailableForRemito() {
      return this.ordenDeCompraService.findAvailableForRemito();
  }

  // 2. Aplicar ParseIntPipe aquí
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordenDeCompraService.findOne(id);
  }
}