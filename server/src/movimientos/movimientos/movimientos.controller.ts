import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { MovimientosService } from './movimientos.service';

@Controller('api/v2/movimientos')
export class MovimientosController {
    constructor(private readonly movimientoService:MovimientosService){}
    /*

    puto el que usa esto 

    */
    @Post()
    create(@Body() createMovimientoDto:CreateMovimientoDto){
        return this.movimientoService.create(createMovimientoDto);

    }
}
