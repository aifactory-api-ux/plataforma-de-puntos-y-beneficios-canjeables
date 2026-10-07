import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ReservasPuntosService } from './reservas-puntos.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { CancelarReservaDto } from './dto/cancelar-reserva.dto';
import { ReservaPuntos } from '../../entities/reserva-puntos.entity';

@ApiTags('Reservas de Puntos')
@Controller('reservas-puntos')
export class ReservasPuntosController {
  constructor(private readonly reservasPuntosService: ReservasPuntosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva reserva de puntos (estado PENDIENTE)' })
  @ApiResponse({
    status: 201,
    description: 'Reserva creada exitosamente',
    type: ReservaPuntos,
  })
  @ApiResponse({ status: 400, description: 'Saldo insuficiente o datos inválidos' })
  @ApiResponse({ status: 404, description: 'Cuenta de puntos no encontrada' })
  async create(@Body() createReservaDto: CreateReservaDto): Promise<ReservaPuntos> {
    return this.reservasPuntosService.create(createReservaDto);
  }

  @Get(':reservaId')
  @ApiOperation({ summary: 'Obtener una reserva de puntos por su ID' })
  @ApiParam({ name: 'reservaId', description: 'Identificador único de la reserva', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Reserva encontrada',
    type: ReservaPuntos,
  })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async findOne(@Param('reservaId', ParseUUIDPipe) reservaId: string): Promise<ReservaPuntos> {
    return this.reservasPuntosService.findOne(reservaId);
  }

  @Get('cuenta/:cuentaId')
  @ApiOperation({ summary: 'Obtener todas las reservas de una cuenta de puntos' })
  @ApiParam({ name: 'cuentaId', description: 'Identificador de la cuenta de puntos', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas de la cuenta',
    type: [ReservaPuntos],
  })
  async findByCuentaId(@Param('cuentaId', ParseUUIDPipe) cuentaId: string): Promise<ReservaPuntos[]> {
    return this.reservasPuntosService.findByCuentaId(cuentaId);
  }

  @Get('cuenta/:cuentaId/activas')
  @ApiOperation({ summary: 'Obtener las reservas activas (PENDIENTE) de una cuenta' })
  @ApiParam({ name: 'cuentaId', description: 'Identificador de la cuenta de puntos', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas activas',
    type: [ReservaPuntos],
  })
  async findActivasByCuentaId(@Param('cuentaId', ParseUUIDPipe) cuentaId: string): Promise<ReservaPuntos[]> {
    return this.reservasPuntosService.getReservasActivas(cuentaId);
  }

  @Post(':reservaId/confirmar')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Confirmar una reserva de puntos (PENDIENTE → CONFIRMADA)' })
  @ApiParam({ name: 'reservaId', description: 'Identificador único de la reserva', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Reserva confirmada exitosamente',
    type: ReservaPuntos,
  })
  @ApiResponse({ status: 400, description: 'No se puede confirmar la reserva' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async confirmar(@Param('reservaId', ParseUUIDPipe) reservaId: string): Promise<ReservaPuntos> {
    return this.reservasPuntosService.confirmar(reservaId);
  }

  @Post(':reservaId/cancelar')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cancelar una reserva de puntos (PENDIENTE → CANCELADA)' })
  @ApiParam({ name: 'reservaId', description: 'Identificador único de la reserva', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Reserva cancelada exitosamente',
    type: ReservaPuntos,
  })
  @ApiResponse({ status: 400, description: 'No se puede cancelar la reserva' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async cancelar(
    @Param('reservaId', ParseUUIDPipe) reservaId: string,
    @Body() cancelarDto: CancelarReservaDto,
  ): Promise<ReservaPuntos> {
    return this.reservasPuntosService.cancelar(reservaId, cancelarDto.motivo);
  }
}
