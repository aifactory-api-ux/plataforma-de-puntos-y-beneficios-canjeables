import { apiFetch } from './api';
import type {
  ReglaPuntos,
  CreateReglaPuntosDto,
  UpdateReglaPuntosDto,
  ConfiguracionRegla,
  CreateConfiguracionReglaDto,
} from '@/types';

export const reglasService = {
  async listarReglas(): Promise<ReglaPuntos[]> {
    return apiFetch<ReglaPuntos[]>('/reglas');
  },

  async obtenerRegla(reglaId: string): Promise<ReglaPuntos> {
    return apiFetch<ReglaPuntos>(`/reglas/${reglaId}`);
  },

  async crearRegla(data: CreateReglaPuntosDto): Promise<ReglaPuntos> {
    return apiFetch<ReglaPuntos>('/reglas', {
      method: 'POST',
      data: JSON.stringify(data),
    });
  },

  async actualizarRegla(reglaId: string, data: UpdateReglaPuntosDto): Promise<ReglaPuntos> {
    return apiFetch<ReglaPuntos>(`/reglas/${reglaId}`, {
      method: 'PUT',
      data: JSON.stringify(data),
    });
  },

  async activarRegla(reglaId: string): Promise<ReglaPuntos> {
    return apiFetch<ReglaPuntos>(`/reglas/${reglaId}/activar`, {
      method: 'PUT',
    });
  },

  async desactivarRegla(reglaId: string): Promise<ReglaPuntos> {
    return apiFetch<ReglaPuntos>(`/reglas/${reglaId}/desactivar`, {
      method: 'PUT',
    });
  },

  async agregarConfiguracion(
    reglaId: string,
    data: CreateConfiguracionReglaDto,
  ): Promise<ConfiguracionRegla> {
    return apiFetch<ConfiguracionRegla>(`/reglas/${reglaId}/configuraciones`, {
      method: 'POST',
      data: JSON.stringify(data),
    });
  },

  async obtenerConfiguraciones(reglaId: string): Promise<ConfiguracionRegla[]> {
    return apiFetch<ConfiguracionRegla[]>(`/reglas/${reglaId}/configuraciones`);
  },

  async reglaVigente(): Promise<ReglaPuntos | null> {
    return apiFetch<ReglaPuntos | null>('/reglas/vigente');
  },
};
