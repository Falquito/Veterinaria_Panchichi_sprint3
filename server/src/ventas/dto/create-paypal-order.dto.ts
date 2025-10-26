import { IsNumber, IsPositive, IsString, IsNotEmpty, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Clase para un item (solo lo esencial para calcular el total)
class OrderItem {
    @IsNumber({}, { message: 'El ID del producto debe ser un número' })
    @IsPositive({ message: 'El ID del producto debe ser positivo' })
    id: number;

    @IsNumber({}, { message: 'El precio debe ser un número' })
    @IsPositive({ message: 'El precio debe ser positivo' })
    precio: number;

    @IsNumber({}, { message: 'La cantidad debe ser un número' })
    @IsPositive({ message: 'La cantidad debe ser positiva' })
    cantidad: number;
}

// DTO para el endpoint POST /paypal/order (inicial)
export class CreatePaypalOrderDto {
    @IsNumber({}, { message: 'El total debe ser un número' })
    @IsPositive({ message: 'El total debe ser un número positivo' })
    total: number;
    
    // Opcional, pero bueno para verificar que el total coincida con los items
    @IsArray({ message: 'Los items deben ser un arreglo' })
    @ArrayMinSize(1, { message: 'Debe haber al menos un producto' })
    @ValidateNested({ each: true, message: 'Uno de los items del pedido no es válido' })
    @Type(() => OrderItem)
    items: OrderItem[];
    
    @IsString()
    @IsNotEmpty()
    currency: string; // Ej: USD, EUR
}