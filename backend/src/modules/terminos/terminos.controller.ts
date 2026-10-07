import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TerminosService, TerminosResponseDto } from './terminos.service';

@ApiTags('Terminos y Condiciones')
@Controller('terminos')
export class TerminosController {
  constructor(private readonly terminosService: TerminosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener la version actual de terminos y condiciones' })
  @ApiResponse({
    status: 200,
    description: 'Terminos y condiciones actuales',
    schema: {
      type: 'object',
      properties: {
        version: { type: 'string', example: '1.0.0' },
        titulo: { type: 'string', example: 'Terminos y Condiciones del Programa de Puntos' },
        contenido: { type: 'string', example: '...terminos completos...' },
        fecha_vigencia: { type: 'string', example: '2026-01-01' },
      },
    },
  })
  async obtenerTerminos(): Promise<TerminosResponseDto> {
    return this.terminosService.obtenerTerminosActuales();
  }
}
