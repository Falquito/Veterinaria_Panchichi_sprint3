import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdenDePagoService } from './orden-de-pago.service';
import { CreateOrdenDePagoDto } from './dto/create-orden-de-pago.dto';
import { UpdateOrdenDePagoDto } from './dto/update-orden-de-pago.dto';

@Controller('orden-de-pago')
export class OrdenDePagoController {
  constructor(private readonly ordenDePagoService: OrdenDePagoService) {}

  @Post()
  create(@Body() createOrdenDePagoDto: CreateOrdenDePagoDto) {
    return this.ordenDePagoService.create(createOrdenDePagoDto);
  }

  @Get()
  findAll() {
    return this.ordenDePagoService.findAll();
  }
}
