import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MovimientosPuntosService } from './movimientos-puntos.service';
import { MovimientoQueryDto } from './dto/query-movimientos.dto';
import { MovimientoPuntos } from '../../entities/movimiento-puntos.entity';

@ApiTags('Movimientos de Puntos')
@Controller('movimientos-puntos')
export class MovimientosPuntosController {
  constructor(private readonly movimientosPuntosService: MovimientosPuntosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar movimientos de puntos con filtros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de movimientos de puntos',
    type: [MovimientoPuntos],
  })
  async findAll(@Query() queryDto: MovimientoQueryDto): Promise<MovimientoPuntos[]> {
    return this.movimientosPuntosService.findAll(queryDto);
  }

  @Get(':movimientoId')
  @ApiOperation({ summary: 'Obtener un movimiento de puntos por su ID' })
  @ApiParam({ name: 'movimientoId', description: 'Identificador único del movimiento', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Movimiento de puntos encontrado',
    type: MovimientoPuntos,
  })
  @ApiResponse({ status: 404, description: 'Movimiento de puntos no encontrado' })
  async findOne(
    @Param('movimientoId', ParseUUIDPipe) movimientoId: string,
  ): Promise<MovimientoPuntos> {
    return this.movimientosPuntosService.findOne(movimientoId);
  }
}

@ApiTags('Movimientos de Puntos')
@Controller('clientes/:clienteId/movimientos')
export class MovimientosPuntosClienteController {
  constructor(private readonly movimientosPuntosService: MovimientosPuntosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener el historial de movimientos de puntos de un cliente' })
  @ApiParam({ name: 'clienteId', description: 'Identificador único del cliente', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Historial de movimientos del cliente',
    type: [MovimientoPuntos],
  })
  async findByClienteId(
    @Param('clienteId', ParseUUIDPipe) clienteId: string,
  ): Promise<MovimientoPuntos[]> {
    return this.movimientosPuntosService.findByClienteId(clienteId);
  }
}

@ApiTags('Movimientos de Puntos')
@Controller('clientes/:clienteId/vencimientos')
export class VencimientosController {
  constructor(private readonly movimientosPuntosService: MovimientosPuntosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener los puntos próximos a vencer de un cliente' })
  @ApiParam({ name: 'clienteId', description: 'Identificador único del cliente', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Puntos próximos a vencer',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          fecha_vencimiento: { type: 'string', example: '2026-11-06' },
          puntos: { type: 'number', example: 150.5 },
          regla_id: { type: 'string', example: 'uuid-de-regla' },
        },
      },
    },
  })
  async getProximosVencimientos(
    @Param('clienteId', ParseUUIDPipe) clienteId: string,
  ): Promise<Array<{ fecha_vencimiento: string; puntos: number; regla_id: string }>> {
    return this.movimientosPuntosService.getProximosVencimientos(clienteId);
  }
}

@ApiTags('Vencimientos')
@Controller('vencimientos')
export class VencimientosGlobalesController {
  constructor(private readonly movimientosPuntosService: MovimientosPuntosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener los puntos próximos a vencer (endpoint global)' })
  @ApiQuery({ name: 'cliente_id', description: 'Identificador único del cliente', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    description: 'Puntos próximos a vencer del cliente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          fecha_vencimiento: { type: 'string', example: '2026-11-06' },
          puntos: { type: 'number', example: 150.5 },
          regla_id: { type: 'string', example: 'uuid-de-regla' },
        },
      },
    },
  })
  async getVencimientosGlobales(
    @Query('cliente_id', ParseUUIDPipe) clienteId: string,
  ): Promise<Array<{ fecha_vencimiento: string; puntos: number; regla_id: string }>> {
    return this.movimientosPuntosService.getProximosVencimientos(clienteId);
  }
}
