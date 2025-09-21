import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComprobanteService } from './comprobante.service';
import { CreateComprobanteDto } from './dto/create-comprobante.dto';
import { UpdateComprobanteDto } from './dto/update-comprobante.dto';

@Controller('comprobante')
export class ComprobanteController {
  constructor(private readonly comprobanteService: ComprobanteService) {}

  @Post()
  create(@Body() createComprobanteDto: CreateComprobanteDto) {
    return this.comprobanteService.create(createComprobanteDto);
  }

  @Get()
  findAll() {
    return this.comprobanteService.findAll();
  }

  
}
