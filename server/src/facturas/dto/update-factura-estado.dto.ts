import { IsIn, IsString, IsUppercase } from 'class-validator';

export class UpdateFacturaEstadoDto {
  @IsString({ message: 'El estado debe ser un texto.' })
  @IsUppercase({ message: 'El estado debe estar en mayúsculas.' })
  @IsIn(['PENDIENTE', 'PAGADO', 'ANULADO', 'CANCELADO'], { message: 'El estado proporcionado no es válido.' })
  estado: string;
}