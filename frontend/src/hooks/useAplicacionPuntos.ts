import { useState, useCallback } from 'react';
import { aplicacionPuntosService, DescuentoInfo } from '../services/aplicacion-puntos';
import type { ReservaPuntos, AplicarPuntosRequestDto } from '../types';

interface UseAplicacionPuntosReturn {
  aplicarPuntos: (clienteId: string, compraId: string, puntosAUsar: number) => Promise<ReservaPuntos>;
  consultarDescuento: (clienteId: string, puntos: number) => Promise<DescuentoInfo>;
  confirmarReserva: (reservaId: string) => Promise<void>;
  cancelarReserva: (reservaId: string) => Promise<void>;
  reserva: ReservaPuntos | null;
  descuentoInfo: DescuentoInfo | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export function useAplicacionPuntos(): UseAplicacionPuntosReturn {
  const [reserva, setReserva] = useState<ReservaPuntos | null>(null);
  const [descuentoInfo, setDescuentoInfo] = useState<DescuentoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aplicarPuntos = useCallback(async (
    clienteId: string,
    compraId: string,
    puntosAUsar: number
  ): Promise<ReservaPuntos> => {
    setLoading(true);
    setError(null);

    try {
      const data: AplicarPuntosRequestDto = {
        cliente_id: clienteId,
        compra_id: compraId,
        puntos_a_usar: puntosAUsar,
      };
      const result = await aplicacionPuntosService.aplicarPuntos(data);
      setReserva(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al aplicar puntos';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const consultarDescuento = useCallback(async (
    clienteId: string,
    puntos: number
  ): Promise<DescuentoInfo> => {
    setLoading(true);
    setError(null);

    try {
      const result = await aplicacionPuntosService.consultarDescuento(clienteId, puntos);
      setDescuentoInfo(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al consultar descuento';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmarReserva = useCallback(async (reservaId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await aplicacionPuntosService.confirmarAplicacion(reservaId);
      setReserva(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al confirmar la reserva';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelarReserva = useCallback(async (reservaId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await aplicacionPuntosService.cancelarAplicacion(reservaId);
      setReserva(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cancelar la reserva';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setReserva(null);
    setDescuentoInfo(null);
    setError(null);
  }, []);

  return {
    aplicarPuntos,
    consultarDescuento,
    confirmarReserva,
    cancelarReserva,
    reserva,
    descuentoInfo,
    loading,
    error,
    reset,
  };
}
