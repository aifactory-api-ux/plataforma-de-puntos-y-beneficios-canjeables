import { apiFetch } from './api';
import type { ReservaPuntos, CreateReservaDto } from '@/types';

export const reservasService = {
  async crearReserva(data: CreateReservaDto): Promise<ReservaPuntos> {
    return apiFetch<ReservaPuntos>('/reservas-puntos', {
      method: 'POST',
      data: JSON.stringify(data),
    });
  },

  async obtenerReserva(reservaId: string): Promise<ReservaPuntos> {
    return apiFetch<ReservaPuntos>(`/reservas-puntos/${reservaId}`);
  },

  async obtenerReservasPorCuenta(cuentaId: string): Promise<ReservaPuntos[]> {
    return apiFetch<ReservaPuntos[]>(`/reservas-puntos/cuenta/${cuentaId}`);
  },

  async obtenerReservasActivas(cuentaId: string): Promise<ReservaPuntos[]> {
    return apiFetch<ReservaPuntos[]>(`/reservas-puntos/cuenta/${cuentaId}/activas`);
  },

  async confirmarReserva(reservaId: string): Promise<ReservaPuntos> {
    return apiFetch<ReservaPuntos>(`/reservas-puntos/${reservaId}/confirmar`, {
      method: 'PATCH',
    });
  },

  async cancelarReserva(reservaId: string, motivo: string): Promise<ReservaPuntos> {
    return apiFetch<ReservaPuntos>(`/reservas-puntos/${reservaId}/cancelar`, {
      method: 'PATCH',
      data: JSON.stringify({ motivo }),
    });
  },
};
