import { 
  IsString, 
  IsNotEmpty, 
  IsEmail, 
  IsNumber, 
  IsPositive, 
  ValidateNested, 
  IsArray, 
  ArrayMinSize, 
  IsObject
} from 'class-validator';
import { Type } from 'class-transformer';

// --- Clases Reutilizadas ---
class BillingInfo {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsEmail() @IsNotEmpty() email: string;
}

class ProductCart {
  @IsNumber() @IsPositive() id: number;
  @IsString() @IsNotEmpty() nombre: string;
  @IsNumber() @IsPositive() precio: number;
  @IsString() imagenURL: string;
  @IsNumber() @IsPositive() cantidad: number;
}

// --- DTO para el endpoint POST /paypal/capture/:orderId ---
export class CapturePaypalSaleDto {

  @IsString({ message: 'El ID de la orden de PayPal debe ser un texto' })
  @IsNotEmpty({ message: 'El ID de la orden de PayPal no puede estar vacío' })
  paypalOrderId: string; // Nuevo campo clave para verificar
  
  @IsObject({ message: 'La información de facturación debe ser un objeto' })
  @ValidateNested({ message: 'La información de facturación no es válida' })
  @Type(() => BillingInfo) 
  billingInfo: BillingInfo;

  // Ya no necesitamos CardInfo
  
  @IsArray({ message: 'Los items deben ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe haber al menos un producto en la venta' })
  @ValidateNested({ each: true, message: 'Uno de los productos no es válido' })
  @Type(() => ProductCart) 
  items: ProductCart[];

  @IsNumber({}, { message: 'El total debe ser un número' })
  @IsPositive({ message: 'El total debe ser un número positivo' })
  total: number;
}