import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimientoPuntos } from '../../entities/movimiento-puntos.entity';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { MovimientoQueryDto } from './dto/query-movimientos.dto';

@Injectable()
export class MovimientosPuntosService {
  constructor(
    @InjectRepository(MovimientoPuntos)
    private readonly movimientoPuntosRepository: Repository<MovimientoPuntos>,
    @InjectRepository(CuentaPuntos)
    private readonly cuentaPuntosRepository: Repository<CuentaPuntos>,
  ) {}

  async findAll(queryDto: MovimientoQueryDto): Promise<MovimientoPuntos[]> {
    const qb = this.movimientoPuntosRepository.createQueryBuilder('movimiento');

    if (queryDto.cuenta_id) {
      qb.andWhere('movimiento.cuenta_id = :cuenta_id', { cuenta_id: queryDto.cuenta_id });
    }

    if (queryDto.tipo_movimiento) {
      qb.andWhere('movimiento.tipo_movimiento = :tipo_movimiento', {
        tipo_movimiento: queryDto.tipo_movimiento,
      });
    }

    if (queryDto.origen) {
      qb.andWhere('movimiento.origen = :origen', { origen: queryDto.origen });
    }

    if (queryDto.fecha_desde) {
      qb.andWhere('movimiento.fecha_movimiento >= :fecha_desde', {
        fecha_desde: new Date(queryDto.fecha_desde),
      });
    }

    if (queryDto.fecha_hasta) {
      qb.andWhere('movimiento.fecha_movimiento <= :fecha_hasta', {
        fecha_hasta: new Date(queryDto.fecha_hasta),
      });
    }

    if (queryDto.cliente_id) {
      const cuentas = await this.cuentaPuntosRepository.find({
        where: { cliente_id: queryDto.cliente_id },
        select: ['cuenta_id'],
      });
      if (cuentas.length === 0) {
        return [];
      }
      const cuentaIds = cuentas.map((c) => c.cuenta_id);
      qb.andWhere('movimiento.cuenta_id IN (:...cuentaIds)', { cuentaIds });
    }

    return qb.orderBy('movimiento.fecha_movimiento', 'DESC').getMany();
  }

  async findOne(movimientoId: string): Promise<MovimientoPuntos> {
    const movimiento = await this.movimientoPuntosRepository.findOne({
      where: { movimiento_id: movimientoId },
      relations: ['cuenta', 'regla_aplicada', 'auditoria'],
    });

    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${movimientoId} no encontrado`);
    }

    return movimiento;
  }

  async findByCuentaId(cuentaId: string): Promise<MovimientoPuntos[]> {
    return this.movimientoPuntosRepository.find({
      where: { cuenta_id: cuentaId },
      order: { fecha_movimiento: 'DESC' },
    });
  }

  async findByClienteId(clienteId: string): Promise<MovimientoPuntos[]> {
    const cuentas = await this.cuentaPuntosRepository.find({
      where: { cliente_id: clienteId },
      select: ['cuenta_id'],
    });

    if (cuentas.length === 0) {
      return [];
    }

    const cuentaIds = cuentas.map((c) => c.cuenta_id);

    return this.movimientoPuntosRepository
      .createQueryBuilder('movimiento')
      .where('movimiento.cuenta_id IN (:...cuentaIds)', { cuentaIds })
      .orderBy('movimiento.fecha_movimiento', 'DESC')
      .getMany();
  }

  async getHistorial(clienteId: string): Promise<{
    movimientos: MovimientoPuntos[];
    total: number;
  }> {
    const cuentas = await this.cuentaPuntosRepository.find({
      where: { cliente_id: clienteId },
      select: ['cuenta_id'],
    });

    if (cuentas.length === 0) {
      return { movimientos: [], total: 0 };
    }

    const cuentaIds = cuentas.map((c) => c.cuenta_id);

    const movimientos = await this.movimientoPuntosRepository
      .createQueryBuilder('movimiento')
      .where('movimiento.cuenta_id IN (:...cuentaIds)', { cuentaIds })
      .orderBy('movimiento.fecha_movimiento', 'DESC')
      .getMany();

    return {
      movimientos,
      total: movimientos.length,
    };
  }

  async getProximosVencimientos(clienteId: string): Promise<
    Array<{
      fecha_vencimiento: string;
      puntos: number;
      regla_id: string;
    }>
  > {
    const cuentas = await this.cuentaPuntosRepository.find({
      where: { cliente_id: clienteId },
      select: ['cuenta_id'],
    });

    if (cuentas.length === 0) {
      return [];
    }

    const cuentaIds = cuentas.map((c) => c.cuenta_id);

    const movimientos = await this.movimientoPuntosRepository
      .createQueryBuilder('movimiento')
      .where('movimiento.cuenta_id IN (:...cuentaIds)', { cuentaIds })
      .andWhere('movimiento.tipo_movimiento = :tipo', { tipo: 'ACUMULACION' })
      .orderBy('movimiento.fecha_movimiento', 'ASC')
      .getMany();

    const vencimientoMap = new Map<
      string,
      { fecha_vencimiento: string; puntos: number; regla_id: string }
    >();

    for (const mov of movimientos) {
      const fechaVencimiento = new Date(mov.fecha_movimiento);
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);
      const key = fechaVencimiento.toISOString().split('T')[0];

      if (vencimientoMap.has(key)) {
        const existing = vencimientoMap.get(key)!;
        existing.puntos += Number(mov.cantidad);
      } else {
        vencimientoMap.set(key, {
          fecha_vencimiento: key,
          puntos: Number(mov.cantidad),
          regla_id: mov.regla_aplicada_id || '',
        });
      }
    }

    return Array.from(vencimientoMap.values()).sort(
      (a, b) => new Date(a.fecha_vencimiento).getTime() - new Date(b.fecha_vencimiento).getTime(),
    );
  }
}
