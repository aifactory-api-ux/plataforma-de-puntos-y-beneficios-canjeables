import { apiFetch } from './api';
import type {
  Compra,
  CreateCompraDto,
  ConfirmarEntregaDto,
  Devolucion,
  CreateDevolucionDto,
  LineaCompra,
} from '@/types';

export const comprasService = {
  async crearCompra(data: CreateCompraDto): Promise<Compra> {
    return apiFetch<Compra>('/compras', {
      method: 'POST',
      data: JSON.stringify(data),
    });
  },

  async obtenerCompra(compraId: string): Promise<Compra> {
    return apiFetch<Compra>(`/compras/${compraId}`);
  },

  async confirmarEntrega(compraId: string, data: ConfirmarEntregaDto): Promise<Compra> {
    return apiFetch<Compra>(`/compras/${compraId}/entrega`, {
      method: 'PUT',
      data: JSON.stringify(data),
    });
  },

  async crearDevolucion(compraId: string, data: CreateDevolucionDto): Promise<Devolucion> {
    return apiFetch<Devolucion>(`/compras/${compraId}/devolucion`, {
      method: 'POST',
      data: JSON.stringify(data),
    });
  },

  async obtenerLineasCompra(compraId: string): Promise<LineaCompra[]> {
    return apiFetch<LineaCompra[]>(`/compras/${compraId}/lineas`);
  },
};
