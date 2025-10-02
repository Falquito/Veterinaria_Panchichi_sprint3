import type { Proveedor, NewProveedorPayload, UpdateProveedorPayload, ProveedoresResponse } from '../types/proveedor.ts';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Error ${response.status}`);
    }
    return response.json();
};

export const proveedoresService = {
    async getProveedores(params: { q?: string; page?: number; limit?: number }): Promise<ProveedoresResponse> {
        const query = new URLSearchParams();
        if (params.q) query.append('q', params.q);
        if (params.page) query.append('page', String(params.page));
        if (params.limit) query.append('limit', String(params.limit));
        
        const response = await fetch(`${API_BASE}/proveedores?${query.toString()}`);
        return handleResponse<ProveedoresResponse>(response);
    },

    async createProveedor(data: NewProveedorPayload): Promise<Proveedor> {
        const response = await fetch(`${API_BASE}/proveedores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse<Proveedor>(response);
    },

    async updateProveedor(id: number, data: UpdateProveedorPayload): Promise<Proveedor> {
        const response = await fetch(`${API_BASE}/proveedores/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse<Proveedor>(response);
    },

    async deleteProveedor(id: number): Promise<void> {
        const response = await fetch(`${API_BASE}/proveedores/${id}`, {
            method: 'DELETE',
        });
        return handleResponse<void>(response);
    },
};