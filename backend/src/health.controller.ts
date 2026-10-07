import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

interface HealthResponse {
  status: string;
  service: string;
  version: string;
  timestamp: string;
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Verificar el estado de salud del servicio' })
  @ApiResponse({
    status: 200,
    description: 'Estado del servicio',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        service: { type: 'string', example: 'plataforma-puntos' },
        version: { type: 'string', example: '1.0.0' },
        timestamp: { type: 'string', example: '2026-10-06T12:00:00.000Z' },
      },
    },
  })
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'plataforma-puntos',
      version: this.configService.get('app.version', { infer: true }) || '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
