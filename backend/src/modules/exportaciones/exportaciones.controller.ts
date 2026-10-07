import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ExportacionesService } from './exportaciones.service';

@ApiTags('Exportaciones')
@Controller('exportaciones')
export class ExportacionesController {
  constructor(private readonly exportacionesService: ExportacionesService) {}

  @Get('movimientos')
  @ApiOperation({ summary: 'Exportar movimientos de puntos en formato CSV' })
  @ApiQuery({ name: 'cliente_id', required: true, description: 'Filtrar por ID del cliente' })
  @ApiQuery({ name: 'format', required: true, description: 'Formato de exportación (csv)', schema: { type: 'string', enum: ['csv'] } })
  @ApiQuery({ name: 'fecha_desde', required: false, description: 'Fecha inicial (ISO 8601)' })
  @ApiQuery({ name: 'fecha_hasta', required: false, description: 'Fecha final (ISO 8601)' })
  @ApiQuery({ name: 'tipo_movimiento', required: false, description: 'Tipo de movimiento', schema: { type: 'string', enum: ['ACUMULACION', 'CANJE', 'VENCIMIENTO', 'AJUSTE', 'DEVOLUCION'] } })
  @ApiResponse({
    status: 200,
    description: 'Archivo CSV con movimientos de puntos',
    content: {
      'text/csv': {
        schema: {
          type: 'string',
          example: 'movimiento_id,cuenta_id,tipo_movimiento,cantidad,fecha_movimiento,origen,regla_aplicada_id\n...',
        },
      },
    },
  })
  async exportarMovimientosCsv(
    @Res() res: any,
    @Query('cliente_id', new ParseUUIDPipe({ optional: false })) clienteId: string,
    @Query('format') format: string,
    @Query('fecha_desde') fechaDesde?: string,
    @Query('fecha_hasta') fechaHasta?: string,
    @Query('tipo_movimiento') tipoMovimiento?: string,
  ): Promise<void> {
    const csv = await this.exportacionesService.generarCsvMovimientos({
      clienteId,
      fechaDesde,
      fechaHasta,
      tipoMovimiento,
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="movimientos_puntos.csv"');
    res.send(csv);
  }

  @Get('movimientos/:cuentaId')
  @ApiOperation({ summary: 'Exportar movimientos de una cuenta especifica en CSV' })
  @ApiParam({ name: 'cuentaId', description: 'Identificador de la cuenta de puntos', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Archivo CSV con movimientos de la cuenta',
    content: {
      'text/csv': {
        schema: {
          type: 'string',
          example: 'movimiento_id,cuenta_id,tipo_movimiento,cantidad,fecha_movimiento,origen\n...',
        },
      },
    },
  })
  async exportarMovimientosCuentaCsv(
    @Param('cuentaId', ParseUUIDPipe) cuentaId: string,
    @Res() res: any,
  ): Promise<void> {
    const csv = await this.exportacionesService.generarCsvMovimientosPorCuenta(cuentaId);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="movimientos_cuenta_${cuentaId}.csv"`);
    res.send(csv);
  }
}
