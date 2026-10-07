import { useState, useCallback } from 'react';
import { clientesService, InscripcionResponse } from '../services/clientes';
import type { InscripcionRequestDto } from '../types';

interface InscripcionReturn {
  inscribir: (datos: Omit<InscripcionRequestDto, 'acepta_terminos' | 'consentimiento_comercial' | 'terminos_version'> & {
    acepta_terminos: boolean;
    consentimiento_comercial: boolean;
    terminos_version: string;
  }) => Promise<void>;
  loading: boolean;
  error: string | null;
  data: InscripcionResponse | null;
}

export function useInscripcion(clienteId: string): InscripcionReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<InscripcionResponse | null>(null);

  const inscribir = useCallback(
    async (datos: {
      acepta_terminos: boolean;
      consentimiento_comercial: boolean;
      terminos_version: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const result = await clientesService.inscribir(clienteId, datos);
        setData(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al realizar la inscripción';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [clienteId]
  );

  return {
    inscribir,
    loading,
    error,
    data,
  };
}
