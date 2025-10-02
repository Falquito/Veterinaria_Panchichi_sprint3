import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdenDePagoDto } from './create-orden-de-pago.dto';

export class UpdateOrdenDePagoDto extends PartialType(CreateOrdenDePagoDto) {}
