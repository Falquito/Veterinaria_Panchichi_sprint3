import { ValidateNested, IsArray, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrdenDeCompraPorProductoDto {
  @IsNumber()
  productoId: number;

  @IsNumber()
  @IsPositive()
  cantidad: number;

  @IsNumber()
  @IsPositive()
  precioUnitario: number;
}

export class CreateOrdenDeCompraDto {
  @IsNumber()
  proveedorId: number;
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrdenDeCompraPorProductoDto)
  productos: CreateOrdenDeCompraPorProductoDto[];
}