import { useState, useEffect } from 'react';
import { API_BASE_URL } from './constants';
import type { Factura, Remito } from '../types/comprobantes';

// Tipo union para manejar ambos tipos de comprobante desde la API
type ComprobanteResponse = Factura | Remito;

export const useComprobantes = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [remitos, setRemitos] = useState<Remito[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComprobantes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/comprobante`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const data: ComprobanteResponse[] = await response.json();
      
      // Separamos facturas y remitos usando type guards
      const facturasData: Factura[] = [];
      const remitosData: Remito[] = [];
      
      data.forEach((comprobante) => {
  const tipo = (comprobante as any)?.tipoDeComprobante?.tipo?.toLowerCase();

  if (tipo === 'factura') {
    facturasData.push(comprobante as Factura);
  } else if (tipo === 'remito') {
    remitosData.push(comprobante as Remito);
  }
});


      setFacturas(facturasData);
      setRemitos(remitosData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los comprobantes');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchComprobantes();
  };

  useEffect(() => {
    fetchComprobantes();
  }, []);

  return {
    facturas,
    remitos,
    loading,
    error,
    refreshData,
  };
};