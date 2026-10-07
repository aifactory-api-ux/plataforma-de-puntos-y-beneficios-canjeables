import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

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
      },
    },
  })
  check(): { status: string; service: string; version: string } {
    const version = this.configService.get<string>('app.version', { infer: true }) || '1.0.0';
    return {
      status: 'ok',
      service: 'plataforma-puntos',
      version,
    };
  }
}
