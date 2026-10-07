import { useState, useCallback } from 'react';
import { terminosService } from '../services/terminos';
import type { TerminosResponseDto } from '../types';

interface TerminosReturn {
  terminos: TerminosResponseDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTerminos(): TerminosReturn {
  const [terminos, setTerminos] = useState<TerminosResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTerminos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await terminosService.obtenerTerminos();
      setTerminos(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar los términos y condiciones';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    terminos,
    loading,
    error,
    refetch: fetchTerminos,
  };
}