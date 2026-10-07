import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService, ResumenAdminDto } from './admin.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('resumen')
  @ApiOperation({ summary: 'Obtener resumen general del programa de puntos' })
  @ApiResponse({
    status: 200,
    description: 'Resumen del programa de puntos',
    schema: {
      type: 'object',
      properties: {
        totalClientes: { type: 'number', example: 1250 },
        totalPuntosDisponibles: { type: 'number', example: 1500000 },
        totalPuntosPendientes: { type: 'number', example: 320000 },
        totalCanjeados: { type: 'number', example: 850000 },
        totalVencidos: { type: 'number', example: 45000 },
        tendencia: { type: 'string', enum: ['up', 'down', 'flat'], example: 'up' },
        fechaActualizacion: { type: 'string', example: '2026-10-07T10:00:00.000Z' },
      },
    },
  })
  async getResumen(): Promise<ResumenAdminDto> {
    return this.adminService.getResumen();
  }
}
