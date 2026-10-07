import { apiFetch } from './api';
import type {
  MovimientoPuntos,
  MovimientoQueryDto,
  ExportMovimientosQueryDto,
} from '@/types';

export interface VencimientoInfo {
  fecha_vencimiento: string;
  puntos: number;
  regla_id: string;
}

export const movimientosService = {
  async listarMovimientos(filtros?: MovimientoQueryDto): Promise<MovimientoPuntos[]> {
    const params: Record<string, string> = {};
    if (filtros) {
      if (filtros.cliente_id) params.cliente_id = filtros.cliente_id;
      if (filtros.cuenta_id) params.cuenta_id = filtros.cuenta_id;
      if (filtros.tipo_movimiento) params.tipo_movimiento = filtros.tipo_movimiento;
      if (filtros.fecha_desde) params.fecha_desde = filtros.fecha_desde;
      if (filtros.fecha_hasta) params.fecha_hasta = filtros.fecha_hasta;
      if (filtros.origen) params.origen = filtros.origen;
    }
    return apiFetch<MovimientoPuntos[]>('/movimientos', { params });
  },

  async obtenerMovimiento(movimientoId: string): Promise<MovimientoPuntos> {
    return apiFetch<MovimientoPuntos>(`/movimientos/${movimientoId}`);
  },

  async obtenerMovimientosPorCliente(
    clienteId: string,
    filtros?: MovimientoQueryDto,
  ): Promise<MovimientoPuntos[]> {
    const params: Record<string, string> = {};
    if (filtros) {
      if (filtros.tipo_movimiento) params.tipo_movimiento = filtros.tipo_movimiento;
      if (filtros.fecha_desde) params.fecha_desde = filtros.fecha_desde;
      if (filtros.fecha_hasta) params.fecha_hasta = filtros.fecha_hasta;
      if (filtros.origen) params.origen = filtros.origen;
    }
    return apiFetch<MovimientoPuntos[]>(`/clientes/${clienteId}/movimientos`, { params });
  },

  async obtenerProximosVencimientos(clienteId: string): Promise<VencimientoInfo[]> {
    return apiFetch<VencimientoInfo[]>('/vencimentoS', { params: { cliente_id: clienteId } });
  },

  async exportarMovimientosCSV(params: ExportMovimientosQueryDto): Promise<void> {
    const queryParams = new URLSearchParams({
      cliente_id: params.cliente_id,
      format: params.format,
    });
    if (params.fecha_desde) queryParams.append('fecha_desde', params.fecha_desde);
    if (params.fecha_hasta) queryParams.append('fecha_hasta', params.fecha_hasta);
    if (params.tipo_movimiento) queryParams.append('tipo_movimiento', params.tipo_movimiento);

    const response = await fetch(`/api/exportaciones/movimientos?${queryParams.toString()}`, {
      headers: {
        Authorization: localStorage.getItem('token')
          ? `Bearer ${localStorage.getItem('token')}`
          : '',
      },
    });

    if (!response.ok) {
      throw new Error('Error al exportar movimientos');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `movimientos_${params.cliente_id}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
