// server/src/compra/compra.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch } from '@nestjs/common'; // 1. Importar ParseIntPipe
import { CompraService } from './compra.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateRemitoEstadoDto } from './dto/update-remito-estado.dto';

@Controller('remito')
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  @Post()
  create(@Body() createCompraDto: CreateCompraDto) {
    return this.compraService.create(createCompraDto);
  }

  @Get()
  findAll() {
    return this.compraService.findAll();
  }

  @Get('available-for-factura')
  findAvailableForFactura() {
      return this.compraService.findAvailableForFactura();
  }

  // 2. Aplicar ParseIntPipe aquí
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.compraService.findOne(id);
  }

  @Patch(':id/estado')
  updateEstado(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRemitoEstadoDto) {
      return this.compraService.updateEstado(id, dto.estado);
  }
}