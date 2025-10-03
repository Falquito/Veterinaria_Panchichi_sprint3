import { IsIn, IsString } from 'class-validator';

export class UpdateRemitoEstadoDto {
  @IsString({ message: 'El estado debe ser un texto.' })
  @IsIn(['Pendiente', 'Recibido', 'Cancelado'], { message: 'El estado proporcionado no es válido.' })
  estado: string;
}