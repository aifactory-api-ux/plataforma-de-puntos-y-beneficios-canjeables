import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimientoPuntos } from '../../entities/movimiento-puntos.entity';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';

export interface FiltrosExportacionMovimientos {
  clienteId?: string;
  cuentaId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  tipoMovimiento?: string;
}

@Injectable()
export class ExportacionesService {
  constructor(
    @InjectRepository(MovimientoPuntos)
    private readonly movimientoRepository: Repository<MovimientoPuntos>,
    @InjectRepository(CuentaPuntos)
    private readonly cuentaRepository: Repository<CuentaPuntos>,
  ) {}

  async generarCsvMovimientos(filtros: FiltrosExportacionMovimientos): Promise<string> {
    const movimientos = await this.obtenerMovimientos(filtros);
    return this.convertirMovimientosACsv(movimientos);
  }

  async generarCsvMovimientosPorCuenta(cuentaId: string): Promise<string> {
    const movimientos = await this.movimientoRepository.find({
      where: { cuenta_id: cuentaId },
      order: { fecha_movimiento: 'DESC' },
    });

    return this.convertirMovimientosACsv(movimientos);
  }

  private async obtenerMovimientos(filtros: FiltrosExportacionMovimientos): Promise<MovimientoPuntos[]> {
    const qb = this.movimientoRepository.createQueryBuilder('movimiento');

    if (filtros.clienteId) {
      const cuentas = await this.cuentaRepository.find({
        where: { cliente_id: filtros.clienteId },
        select: ['cuenta_id'],
      });

      if (cuentas.length === 0) {
        return [];
      }

      const cuentaIds = cuentas.map((c) => c.cuenta_id);
      qb.andWhere('movimiento.cuenta_id IN (:...cuentaIds)', { cuentaIds });
    }

    if (filtros.fechaDesde) {
      qb.andWhere('movimiento.fecha_movimiento >= :fechaDesde', {
        fechaDesde: new Date(filtros.fechaDesde),
      });
    }

    if (filtros.fechaHasta) {
      qb.andWhere('movimiento.fecha_movimiento <= :fechaHasta', {
        fechaHasta: new Date(filtros.fechaHasta),
      });
    }

    if (filtros.tipoMovimiento) {
      qb.andWhere('movimiento.tipo_movimiento = :tipoMovimiento', {
        tipoMovimiento: filtros.tipoMovimiento,
      });
    }

    return qb.orderBy('movimiento.fecha_movimiento', 'DESC').getMany();
  }

  private convertirMovimientosACsv(movimientos: MovimientoPuntos[]): string {
    const headers = [
      'movimiento_id',
      'cuenta_id',
      'tipo_movimiento',
      'cantidad',
      'fecha_movimiento',
      'origen',
      'regla_aplicada_id',
      'auditoria_id',
    ];

    const headerLine = headers.join(',');

    const rows = movimientos.map((mov) => {
      return [
        this.escaparCsv(mov.movimiento_id),
        this.escaparCsv(mov.cuenta_id),
        this.escaparCsv(mov.tipo_movimiento),
        mov.cantidad?.toString() || '',
        this.escaparCsv(mov.fecha_movimiento),
        this.escaparCsv(mov.origen || ''),
        this.escaparCsv(mov.regla_aplicada_id || ''),
        this.escaparCsv(mov.auditoria_id || ''),
      ].join(',');
    });

    return [headerLine, ...rows].join('\n');
  }

  private escaparCsv(valor: string): string {
    if (!valor) return '';
    const escaped = valor.replace(/"/g, '""');
    if (escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')) {
      return `"${escaped}"`;
    }
    return escaped;
  }
}
