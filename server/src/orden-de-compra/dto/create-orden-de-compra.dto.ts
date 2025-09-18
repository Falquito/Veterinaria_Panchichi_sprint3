import { ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';




import { IsNumber } from 'class-validator';

export class CreateOrdenDeCompraPorProductoDto {
  @IsNumber()
  productoId: number;

  @IsNumber()
  cantidad: number;
}

export class CreateOrdenDeCompraDto {
  @IsNumber()
  proveedorId:number;
  @IsArray()
  @Type(() => CreateOrdenDeCompraPorProductoDto)
  productos: CreateOrdenDeCompraPorProductoDto[];


}
