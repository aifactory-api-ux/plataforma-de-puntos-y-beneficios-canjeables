import { apiFetch } from './api';
import type { TerminosResponseDto } from '@/types';

export const terminosService = {
  async obtenerTerminos(): Promise<TerminosResponseDto> {
    return apiFetch<TerminosResponseDto>('/terminos');
  },
};
