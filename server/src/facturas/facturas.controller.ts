// server/src/facturas/facturas.controller.ts
import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch } from '@nestjs/common'; // 1. Importar ParseIntPipe
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaEstadoDto } from './dto/update-factura-estado.dto';

@Controller('facturas')
export class FacturasController {
  constructor(private readonly service: FacturasService) {}

  @Post()
  create(@Body() dto: CreateFacturaDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  // 2. Aplicar ParseIntPipe aquí
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
  @Patch(':id/estado')
  updateEstado(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFacturaEstadoDto) {
    return this.service.updateEstado(id, dto.estado);
  }

  @Get('pendientes/:proveedorId')
findPendientes(@Param('proveedorId', ParseIntPipe) proveedorId: number) {
    return this.service.findPendientes(proveedorId);
}
}