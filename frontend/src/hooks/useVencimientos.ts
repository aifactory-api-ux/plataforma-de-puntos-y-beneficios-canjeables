import { useState, useCallback } from 'react';
import { movimientosService } from '../services/movimientos';

interface Vencimiento {
  fecha_vencimiento: string;
  puntos: number;
  regla_id: string;
}

interface VencimientosReturn {
  vencimientos: Vencimiento[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useVencimientos(clienteId: string): VencimientosReturn {
  const [vencimientos, setVencimientos] = useState<Vencimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVencimientos = useCallback(async () => {
    if (!clienteId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await movimientosService.obtenerProximosVencimientos(clienteId);
      setVencimientos(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar los vencimientos';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  return {
    vencimientos,
    loading,
    error,
    refetch: fetchVencimientos,
  };
}