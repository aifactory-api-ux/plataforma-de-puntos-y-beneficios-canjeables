import { useState, useCallback } from 'react';
import { movimientosService } from '../services/movimientos';
import type { MovimientoPuntos, MovimientoQueryDto } from '../types';

interface HistorialReturn {
  movimientos: MovimientoPuntos[];
  filtros: Record<string, string>;
  setFiltros: (filtros: Record<string, string>) => void;
  loading: boolean;
  error: string | null;
  exportarCSV: () => Promise<void>;
  refetch: () => void;
}

export function useHistorial(clienteId: string): HistorialReturn {
  const [movimientos, setMovimientos] = useState<MovimientoPuntos[]>([]);
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovimientos = useCallback(async () => {
    if (!clienteId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const filtroDto: MovimientoQueryDto = {
        cliente_id: clienteId,
      };

      if (filtros.tipo_movimiento) {
        filtroDto.tipo_movimiento = filtros.tipo_movimiento as MovimientoQueryDto['tipo_movimiento'];
      }
      if (filtros.fecha_desde) {
        filtroDto.fecha_desde = filtros.fecha_desde;
      }
      if (filtros.fecha_hasta) {
        filtroDto.fecha_hasta = filtros.fecha_hasta;
      }
      if (filtros.origen) {
        filtroDto.origen = filtros.origen;
      }

      const data = await movimientosService.obtenerMovimientosPorCliente(clienteId, filtroDto);
      setMovimientos(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar el historial de movimientos';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [clienteId, filtros]);

  const handleSetFiltros = useCallback((newFiltros: Record<string, string>) => {
    setFiltros(newFiltros);
  }, []);

  const exportarCSV = useCallback(async () => {
    try {
      await movimientosService.exportarMovimientosCSV({
        cliente_id: clienteId,
        fecha_desde: filtros.fecha_desde,
        fecha_hasta: filtros.fecha_hasta,
        tipo_movimiento: filtros.tipo_movimiento as MovimientoQueryDto['tipo_movimiento'],
        format: 'csv',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al exportar el historial';
      setError(message);
      throw err;
    }
  }, [clienteId, filtros]);

  return {
    movimientos,
    filtros,
    setFiltros: handleSetFiltros,
    loading,
    error,
    exportarCSV,
    refetch: fetchMovimientos,
  };
}