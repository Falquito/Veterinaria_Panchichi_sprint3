// paypal.service.ts
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaypalService {
    private readonly logger = new Logger(PaypalService.name);
    private readonly PAYPAL_BASE_URL: string;
    private readonly CLIENT_ID: string;
    private readonly CLIENT_SECRET: string;

    constructor(
        private httpService: HttpService,
        private configService: ConfigService,
    ) {
        this.PAYPAL_BASE_URL = this.configService.get<string>('PAYPAL_BASE_URL');
        this.CLIENT_ID = this.configService.get<string>('PAYPAL_CLIENT_ID');
        this.CLIENT_SECRET = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
    }

    // --- 1. OBTENER TOKEN DE ACCESO ---
    public async generateAccessToken(): Promise<string> {
        try {
            const auth = Buffer.from(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`).toString('base64');
            
            const response$ = this.httpService.post(
                `${this.PAYPAL_BASE_URL}/v1/oauth2/token`,
                'grant_type=client_credentials', // Cuerpo de la petición es un string
                {
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            );

            const { data } = await firstValueFrom(response$);
            return data.access_token;
        } catch (error) {
            this.logger.error('Error al generar token de PayPal', error.response?.data || error.message);
            throw new InternalServerErrorException('Error al autenticar con PayPal.');
        }
    }

    // --- 2. CREAR ORDEN DE PAGO (Llamada desde el Controller) ---
    async createOrder(amount: string, currency: string) {
        const accessToken = await this.generateAccessToken();
        const url = `${this.PAYPAL_BASE_URL}/v2/checkout/orders`;

        const orderPayload = {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: currency,
                    value: amount,
                },
                
            }],
        };

        try {
            const response$ = this.httpService.post(url, orderPayload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const { data } = await firstValueFrom(response$);
            return data; // Devuelve la orden completa de PayPal
        } catch (error) {
            this.logger.error('Error al crear orden de PayPal', error.response?.data || error.message);
            throw new InternalServerErrorException('Error al crear la orden de pago.');
        }
    }

    // --- 3. CAPTURAR PAGO (Llamada desde el Controller) ---
    async captureOrder(orderId: string) {
        const accessToken = await this.generateAccessToken();
        const url = `${this.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`;

        try {
            const response$ = this.httpService.post(url, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const { data } = await firstValueFrom(response$);
            return data; // Devuelve el resultado de la captura de PayPal
        } catch (error) {
            this.logger.error('Error al capturar pago de PayPal', error.response?.data || error.message);
            throw new InternalServerErrorException('Error al capturar el pago.');
        }
    }
}