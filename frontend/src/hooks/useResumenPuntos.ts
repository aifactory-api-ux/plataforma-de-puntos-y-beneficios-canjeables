import { useState, useCallback } from 'react';
import { clientesService } from '../services/clientes';
import { movimientosService } from '../services/movimientos';
import type { MovimientoPuntos } from '../types';

interface ResumenPuntosReturn {
  disponible: number;
  pendiente: number;
  equivalenciaCOP: number;
  exchangeRate: number;
  expiresSoonCount: number;
  recentMovements: MovimientoPuntos[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const EXCHANGE_RATE = 100;

export function useResumenPuntos(clienteId: string): ResumenPuntosReturn {
  const [disponible, setDisponible] = useState(0);
  const [pendiente, setPendiente] = useState(0);
  const [recentMovements, setRecentMovements] = useState<MovimientoPuntos[]>([]);
  const [expiresSoonCount, setExpiresSoonCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!clienteId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [cuentaData, movimientosData, vencimientosData] = await Promise.all([
        clientesService.obtenerCuentaPuntos(clienteId),
        clientesService.obtenerMovimientos(clienteId, {}),
        movimientosService.obtenerProximosVencimientos(clienteId),
      ]);

      setDisponible(cuentaData.saldo_actual);
      setPendiente(cuentaData.saldo_pendiente);
      setRecentMovements(movimientosData.slice(0, 5));

      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const upcomingExpirations = vencimientosData.filter((v) => {
        const expDate = new Date(v.fecha_vencimiento);
        return expDate <= thirtyDaysFromNow;
      });
      setExpiresSoonCount(
        upcomingExpirations.reduce((sum, v) => sum + v.puntos, 0)
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar el resumen de puntos';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  const equivalenciaCOP = (disponible + pendiente) * EXCHANGE_RATE;

  return {
    disponible,
    pendiente,
    equivalenciaCOP,
    exchangeRate: EXCHANGE_RATE,
    expiresSoonCount,
    recentMovements,
    loading,
    error,
    refetch: fetchData,
  };
}
