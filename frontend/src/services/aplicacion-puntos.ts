import { apiFetch } from './api';
import type { AplicarPuntosRequestDto, ReservaPuntos } from '@/types';

export interface AplicarPuntosResponse {
  reserva_id: string;
  estado: string;
}

export interface DescuentoInfo {
  descuento_cop: number;
  viable: boolean;
  mensaje?: string;
}

export const aplicacionPuntosService = {
  async aplicarPuntos(data: AplicarPuntosRequestDto): Promise<ReservaPuntos> {
    return apiFetch<ReservaPuntos>('/aplicacion-puntos', {
      method: 'POST',
      data: JSON.stringify(data),
    });
  },

  async consultarDescuento(clienteId: string, puntos: number): Promise<DescuentoInfo> {
    return apiFetch<DescuentoInfo>('/aplicacion-puntos/consulta', {
      params: {
        cliente_id: clienteId,
        puntos: String(puntos),
      },
    });
  },

  async confirmarAplicacion(reservaId: string): Promise<AplicarPuntosResponse> {
    return apiFetch<AplicarPuntosResponse>(`/aplicacion-puntos/${reservaId}/confirmar`, {
      method: 'PATCH',
    });
  },

  async cancelarAplicacion(reservaId: string): Promise<AplicarPuntosResponse> {
    return apiFetch<AplicarPuntosResponse>(`/aplicacion-puntos/${reservaId}/cancelar`, {
      method: 'PATCH',
    });
  },
};
