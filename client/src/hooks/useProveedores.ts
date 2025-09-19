import { useState, useEffect, useCallback } from 'react';
import { proveedoresService } from '../services/proveedoresService.ts';
import type { Proveedor, ProveedoresResponse } from '../types/proveedor.ts';

export function useProveedores() {
  const [paginated, setPaginated] = useState<ProveedoresResponse>({
      items: [], total: 0, page: 1, limit: 10, pages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchProveedores = useCallback(async (query: string) => {
    try {
      setLoading(true);
      const data = await proveedoresService.getProveedores({ q: query });
      setPaginated(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProveedores(search);
    }, 300); // Debounce
    return () => clearTimeout(handler);
  }, [search, fetchProveedores]);

  return {
    paginated,
    loading,
    error,
    search,
    setSearch,
    refresh: () => fetchProveedores(search)
  };
}