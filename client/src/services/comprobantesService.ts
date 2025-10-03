// client/src/services/comprobantesService.ts
import type { Remito, Factura, OrdenDeCompra, DetalleRemito, DetalleFactura } from '../types/comprobantes';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ComprobantesService {
    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }
        return response.json();
    }

    // --- REMITOS ---
    async getRemitos(): Promise<Remito[]> {
        const response = await fetch(`${API_BASE_URL}/remito`);
        return this.handleResponse<Remito[]>(response);
    }
    
    async getRemitoById(id: number): Promise<DetalleRemito> {
        const response = await fetch(`${API_BASE_URL}/remito/${id}`);
        return this.handleResponse<DetalleRemito>(response);
    }

    async createRemito(data: any): Promise<Remito> {
        const response = await fetch(`${API_BASE_URL}/remito`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return this.handleResponse<Remito>(response);
    }

    async getAvailableRemitos(): Promise<Remito[]> {
        const response = await fetch(`${API_BASE_URL}/remito/available-for-factura`);
        return this.handleResponse<Remito[]>(response);
    }

    async updateRemitoEstado(id: number, estado: string): Promise<Remito> {
        const response = await fetch(`${API_BASE_URL}/remito/${id}/estado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado }),
        });
        return this.handleResponse<Remito>(response);
    }


    // --- FACTURAS ---
    async getFacturas(): Promise<Factura[]> {
        const response = await fetch(`${API_BASE_URL}/facturas`);
        return this.handleResponse<Factura[]>(response);
    }
    
    // --- MÉTODO AÑADIDO ---
    async getFacturasPendientes(proveedorId: number): Promise<Factura[]> {
        const response = await fetch(`${API_BASE_URL}/facturas/pendientes/${proveedorId}`);
        return this.handleResponse<Factura[]>(response);
    }
    // ----------------------
    
    async getFacturaById(id: number): Promise<DetalleFactura> {
        const response = await fetch(`${API_BASE_URL}/facturas/${id}`);
        return this.handleResponse<DetalleFactura>(response);
    }

    async createFactura(data: any): Promise<Factura> {
        const response = await fetch(`${API_BASE_URL}/facturas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return this.handleResponse<Factura>(response);
    }
    
    async updateFacturaEstado(id: number, estado: string): Promise<Factura> {
        const response = await fetch(`${API_BASE_URL}/facturas/${id}/estado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado }),
        });
        return this.handleResponse<Factura>(response);
    }

    // --- ORDEN DE COMPRA ---
    async getAvailableOCs(): Promise<OrdenDeCompra[]> {
        const response = await fetch(`${API_BASE_URL}/orden-de-compra/available-for-remito`);
        return this.handleResponse<OrdenDeCompra[]>(response);
    }
}

export const comprobantesService = new ComprobantesService();
export type { Remito, Factura, OrdenDeCompra, DetalleRemito, DetalleFactura };