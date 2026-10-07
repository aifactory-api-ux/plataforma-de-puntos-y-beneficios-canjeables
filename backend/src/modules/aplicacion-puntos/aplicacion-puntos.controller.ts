import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AplicacionPuntosService } from './aplicacion-puntos.service';
import { AplicarPuntosRequestDto, AplicarPuntosResponseDto } from './dto/aplicar-puntos.dto';

@ApiTags('Aplicación de Puntos')
@Controller('aplicacion-puntos')
export class AplicacionPuntosController {
  constructor(private readonly aplicacionPuntosService: AplicacionPuntosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Aplicar puntos durante el checkout (crea reserva en Redis)' })
  @ApiResponse({
    status: 201,
    description: 'Reserva de puntos creada exitosamente',
    type: AplicarPuntosResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Saldo insuficiente o datos inválidos' })
  @ApiResponse({ status: 404, description: 'Cliente o cuenta no encontrada' })
  async aplicarPuntos(@Body() dto: AplicarPuntosRequestDto): Promise<AplicarPuntosResponseDto> {
    return this.aplicacionPuntosService.aplicarPuntos(dto);
  }

  @Get('consulta')
  @ApiOperation({ summary: 'Consultar el descuento posible para una cantidad de puntos' })
  @ApiQuery({ name: 'cliente_id', description: 'Identificador del cliente', type: 'string' })
  @ApiQuery({ name: 'puntos', description: 'Cantidad de puntos a consultar', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Información del descuento posible',
    schema: {
      type: 'object',
      properties: {
        descuento_cop: { type: 'number', example: 20000 },
        viable: { type: 'boolean', example: true },
        mensaje: { type: 'string', example: '' },
      },
    },
  })
  async consultarDescuento(
    @Query('cliente_id', ParseUUIDPipe) clienteId: string,
    @Query('puntos') puntos: number,
  ): Promise<{ descuento_cop: number; viable: boolean; mensaje?: string }> {
    return this.aplicacionPuntosService.consultarDescuentoPosible(clienteId, Number(puntos));
  }

  @Patch(':reservaId/confirmar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmar la aplicación de puntos (confirma la reserva)' })
  @ApiParam({ name: 'reservaId', description: 'Identificador de la reserva', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Aplicación confirmada exitosamente',
    schema: {
      type: 'object',
      properties: {
        reserva_id: { type: 'string' },
        estado: { type: 'string', example: 'CONFIRMADA' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'No se puede confirmar la reserva' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async confirmarAplicacion(@Param('reservaId', ParseUUIDPipe) reservaId: string) {
    const reserva = await this.aplicacionPuntosService.confirmarAplicacion(reservaId);
    return {
      reserva_id: reserva.reserva_id,
      estado: reserva.estado,
    };
  }

  @Patch(':reservaId/cancelar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar la aplicación de puntos (cancela la reserva)' })
  @ApiParam({ name: 'reservaId', description: 'Identificador de la reserva', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Aplicación cancelada exitosamente',
    schema: {
      type: 'object',
      properties: {
        reserva_id: { type: 'string' },
        estado: { type: 'string', example: 'CANCELADA' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'No se puede cancelar la reserva' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async cancelarAplicacion(@Param('reservaId', ParseUUIDPipe) reservaId: string) {
    const reserva = await this.aplicacionPuntosService.cancelarAplicacion(reservaId);
    return {
      reserva_id: reserva.reserva_id,
      estado: reserva.estado,
    };
  }
}
