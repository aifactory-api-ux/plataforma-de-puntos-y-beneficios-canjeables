import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CuentasPuntosService } from './cuentas-puntos.service';
import { AdjustCuentaDto } from './dto/adjust-cuenta.dto';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { MovimientoPuntos } from '../../entities/movimiento-puntos.entity';

@ApiTags('Cuentas de Puntos')
@Controller('cuentas-puntos')
export class CuentasPuntosController {
  constructor(private readonly cuentasPuntosService: CuentasPuntosService) {}

  @Get(':cuentaId')
  @ApiOperation({ summary: 'Obtener una cuenta de puntos por su ID' })
  @ApiParam({ name: 'cuentaId', description: 'Identificador único de la cuenta de puntos', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Cuenta de puntos encontrada',
    type: CuentaPuntos,
  })
  @ApiResponse({ status: 404, description: 'Cuenta de puntos no encontrada' })
  async findOne(@Param('cuentaId', ParseUUIDPipe) cuentaId: string): Promise<CuentaPuntos> {
    return this.cuentasPuntosService.findOne(cuentaId);
  }

  @Post(':cuentaId/ajuste')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Realizar un ajuste manual de puntos con registro de auditoría' })
  @ApiParam({ name: 'cuentaId', description: 'Identificador único de la cuenta de puntos', type: 'string' })
  @ApiResponse({
    status: 201,
    description: 'Ajuste realizado exitosamente',
    type: CuentaPuntos,
  })
  @ApiResponse({ status: 400, description: 'El ajuste resultaría en un saldo negativo' })
  @ApiResponse({ status: 404, description: 'Cuenta de puntos no encontrada' })
  async adjust(
    @Param('cuentaId', ParseUUIDPipe) cuentaId: string,
    @Body() adjustDto: AdjustCuentaDto,
  ): Promise<CuentaPuntos> {
    return this.cuentasPuntosService.adjust(cuentaId, adjustDto);
  }

  @Get(':cuentaId/movimientos')
  @ApiOperation({ summary: 'Obtener los movimientos de puntos de una cuenta' })
  @ApiParam({ name: 'cuentaId', description: 'Identificador único de la cuenta de puntos', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Movimientos de la cuenta de puntos',
    type: [MovimientoPuntos],
  })
  @ApiResponse({ status: 404, description: 'Cuenta de puntos no encontrada' })
  async findMovimientos(
    @Param('cuentaId', ParseUUIDPipe) cuentaId: string,
  ): Promise<MovimientoPuntos[]> {
    return this.cuentasPuntosService.findMovimientosByCuentaId(cuentaId);
  }
}
