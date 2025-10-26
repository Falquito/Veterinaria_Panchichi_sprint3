// paypal.controller.ts

import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { VentasService } from 'src/ventas/ventas.service'; // Asegúrate de la ruta correcta

import { CapturePaypalSaleDto } from 'src/ventas/dto/capture-paypal-sale.dto'; // DTO Final
import { CreatePaypalOrderDto } from 'src/ventas/dto/create-paypal-order.dto';

@Controller('paypal')
export class PaypalController {
    constructor(
        private readonly paypalService: PaypalService,
        private readonly ventasService: VentasService, // 👈 Inyección de VentasService
    ) {}

    // POST /paypal/order
    // 💡 Endpoint llamado por el frontend para INICIAR la orden de PayPal
    @Post('order')
    async createPaypalOrder(@Body() createOrderDto: CreatePaypalOrderDto) {
        // En un caso real, podrías validar si el total calculado del DTO
        // coincide con el total de la base de datos antes de enviar a PayPal.
        
        const order = await this.paypalService.createOrder(
            createOrderDto.total.toFixed(2), // Formato requerido por PayPal
            createOrderDto.currency 
        );
        
        return {
            orderId: order.id,
            links: order.links,
        };
    }

    // POST /paypal/capture/:orderId
    // 💡 Endpoint llamado por el frontend para CAPTURAR el pago y REGISTRAR la venta
    @Post('capture/:orderId')
    async capturePaypalOrder(
        @Param('orderId') orderId: string,
        // El frontend envía el DTO completo con los detalles de la venta
        @Body() captureDto: CapturePaypalSaleDto, 
    ) {
        // 1. Capturar el pago en PayPal
        const captureResult = await this.paypalService.captureOrder(orderId);
        
        if (captureResult.status !== 'COMPLETED') {
            // Manejar errores de pago que no se completaron
            throw new Error(`El pago de PayPal no se completó. Estado: ${captureResult.status}`);
        }
        
        // 2. VERIFICACIÓN CRÍTICA: Asegúrate de que el orderId del DTO coincida con el Param
        if (captureDto.paypalOrderId !== orderId) {
             throw new Error("Discrepancia de ID de orden de PayPal. Transacción abortada.");
        }
        
        // 3. Registrar la Venta en la DB (Solo si el pago fue COMPLETADO)
        const ventaRegistrada = await this.ventasService.registerSaleFromPaypal(
            captureDto
        );
        
        // 4. Respuesta de éxito
        return {
            status: 'SUCCESS',
            message: 'Pago capturado y venta registrada.',
            ventaId: ventaRegistrada.id_venta,
            paypalTransactionId: captureResult.id,
        };
    }


    @Get("prueba")
    token(){
      return this.paypalService.generateAccessToken()
    }
}