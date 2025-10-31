import { 
  IsString, 
  IsNotEmpty, 
  IsEmail, 
  IsNumber, 
  IsPositive, 
  ValidateNested, 
  IsArray, 
  ArrayMinSize, 
  IsCreditCard,
  Length,
  Matches,
  IsObject,
  IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';

// --- Clase para BillingInfo ---
// (Convertida de interface a class)
class BillingInfo {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  name: string;

  @IsString({ message: 'El apellido debe ser un texto' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
  lastName: string;

  @IsEmail({}, { message: 'El email no es válido' })
  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  email: string;
}

// --- Clase para CardInfo ---
// (Convertida de interface a class)
class CardInfo {
  @IsString({ message: 'El nombre del titular debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre del titular no puede estar vacío' })
  name: string;


  @IsNotEmpty({ message: 'El número de tarjeta no puede estar vacío' })
  number: string;

  @IsString()
  @Length(2, 2, { message: 'El mes de expiración debe ser de 2 dígitos (MM)' })
  @Matches(/^(0[1-9]|1[0-2])$/, { message: 'El mes de expiración debe ser un mes válido (01-12)' })
  expMonth: string;

  @IsString()
  @Length(2, 2, { message: 'El año de expiración debe ser de 2 dígitos (AA)' })
  @Matches(/^\d{2}$/, { message: 'El año de expiración debe ser de 2 dígitos' })
  expYear: string;
}

// --- Clase para ProductCart ---
// (Convertida de interface a class)
class ProductCart {
  @IsNumber({}, { message: 'El ID del producto debe ser un número' })
  @IsPositive({ message: 'El ID del producto debe ser positivo' })
  id: number;

  @IsString({ message: 'El nombre del producto debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre del producto no puede estar vacío' })
  nombre: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser positivo' })
  precio: number;

  @IsString({ message: 'La URL de la imagen debe ser un texto' })
  @IsOptional()
  imagenURL: string; // Opcional: @IsUrl() si quieres validar que sea una URL

  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @IsPositive({ message: 'La cantidad debe ser positiva' })
  cantidad: number;
}

// --- DTO Principal ---
export class CreateVentaDto {

  @IsObject({ message: 'La información de facturación debe ser un objeto' })
  @ValidateNested({ message: 'La información de facturación no es válida' })
  @Type(() => BillingInfo) // <-- Importante para la validación anidada
  billingInfo: BillingInfo;

  @IsObject({ message: 'La información de la tarjeta debe ser un objeto' })
  @ValidateNested({ message: 'La información de la tarjeta no es válida' })
  @Type(() => CardInfo) // <-- Importante para la validación anidada
  @IsOptional()
  cardInfo: CardInfo;

  @IsArray({ message: 'Los items deben ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe haber al menos un producto en la venta' })
  @ValidateNested({ each: true, message: 'Uno de los productos no es válido' }) // <-- Valida CADA item del array
  @Type(() => ProductCart) // <-- Importante para la validación anidada en arrays
  items: ProductCart[];

  @IsNumber({}, { message: 'El total debe ser un número' })
  @IsPositive({ message: 'El total debe ser un número positivo' })
  total: number;
}
