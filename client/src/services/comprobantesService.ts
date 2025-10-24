import type { Remito, Factura } from '../types/comprobantes';


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

    async getRemitos(): Promise<Remito[]> {
        const response = await fetch(`${API_BASE_URL}/remito`);
        return this.handleResponse<Remito[]>(response);
    }

    async getFacturas(): Promise<Factura[]> {
        const response = await fetch(`${API_BASE_URL}/facturas`);
        return this.handleResponse<Factura[]>(response);
    }
    
    async confirmarRemito(remitoId: number, depositoId: number): Promise<Remito> {
        const response = await fetch(`${API_BASE_URL}/remito/${remitoId}/recibir`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ depositoId }),
        });
        return this.handleResponse<Remito>(response);
    }

   async getComprobanteById(comprobanteId: number): Promise<Factura> {
    const response = await fetch(`${API_BASE_URL}/comprobante/${comprobanteId}`);
    return this.handleResponse<Factura>(response);
}

// En ComprobantesService
async getOrdenesDeComprobanteUsado(comprobanteId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/orden-de-pago/comprobante/${comprobanteId}`);
    return this.handleResponse<any[]>(response);
}
    
}



export const comprobantesService = new ComprobantesService();
export type { Remito, Factura };