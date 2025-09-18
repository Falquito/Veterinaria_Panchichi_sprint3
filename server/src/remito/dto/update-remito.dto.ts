import { PartialType } from '@nestjs/mapped-types';
import { CreateRemitoDto } from './create-remito.dto';

export class UpdateRemitoDto extends PartialType(CreateRemitoDto) {}
