import { apiFetch } from './api';
import type { AdminResumenDto, Auditoria } from '@/types';

export const adminService = {
  async obtenerResumen(): Promise<AdminResumenDto> {
    return apiFetch<AdminResumenDto>('/admin/resumen');
  },

  async listarAuditorias(params?: {
    usuario_admin?: string;
    accion?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
  }): Promise<Auditoria[]> {
    const queryParams: Record<string, string> = {};
    if (params?.usuario_admin) queryParams.usuario_admin = params.usuario_admin;
    if (params?.accion) queryParams.accion = params.accion;
    if (params?.fecha_desde) queryParams.fecha_desde = params.fecha_desde;
    if (params?.fecha_hasta) queryParams.fecha_hasta = params.fecha_hasta;

    return apiFetch<Auditoria[]>('/auditorias', { params: queryParams });
  },

  async obtenerAuditoria(auditoriaId: string): Promise<Auditoria> {
    return apiFetch<Auditoria>(`/auditorias/${auditoriaId}`);
  },
};
