import { apiFetch } from './api';
import type {
  Cliente,
  CreateClienteDto,
  CuentaPuntos,
  InscripcionRequestDto,
  Compra,
  MovimientoPuntos,
  MovimientoQueryDto,
  AdminResumenDto,
} from '@/types';

export interface InscripcionResponse {
  cliente_id: string;
  cuenta_id: string;
  estado: string;
}

export const clientesService = {
  async crearCliente(data: CreateClienteDto): Promise<Cliente> {
    return apiFetch<Cliente>('/clientes', {
      method: 'POST',
      data: JSON.stringify(data),
    });
  },

  async obtenerCliente(clienteId: string): Promise<Cliente> {
    return apiFetch<Cliente>(`/clientes/${clienteId}`);
  },

  async obtenerCuentaPuntos(clienteId: string): Promise<CuentaPuntos> {
    return apiFetch<CuentaPuntos>(`/clientes/${clienteId}/cuenta-puntos`);
  },

  async obtenerCompras(clienteId: string): Promise<Compra[]> {
    return apiFetch<Compra[]>(`/clientes/${clienteId}/compras`);
  },

  async obtenerMovimientos(
    clienteId: string,
    filtros?: MovimientoQueryDto,
  ): Promise<MovimientoPuntos[]> {
    const params: Record<string, string> = {};
    if (filtros) {
      if (filtros.cliente_id) params.cliente_id = filtros.cliente_id;
      if (filtros.cuenta_id) params.cuenta_id = filtros.cuenta_id;
      if (filtros.tipo_movimiento) params.tipo_movimiento = filtros.tipo_movimiento;
      if (filtros.fecha_desde) params.fecha_desde = filtros.fecha_desde;
      if (filtros.fecha_hasta) params.fecha_hasta = filtros.fecha_hasta;
      if (filtros.origen) params.origen = filtros.origen;
    }
    return apiFetch<MovimientoPuntos[]>(`/clientes/${clienteId}/movimientos`, { params });
  },

  async inscribir(
    clienteId: string,
    data: InscripcionRequestDto,
  ): Promise<InscripcionResponse> {
    return apiFetch<InscripcionResponse>(`/clientes/${clienteId}/inscripcion`, {
      method: 'POST',
      data: JSON.stringify(data),
    });
  },

  async obtenerResumen(): Promise<AdminResumenDto> {
    return apiFetch<AdminResumenDto>('/admin/resumen');
  },
};
