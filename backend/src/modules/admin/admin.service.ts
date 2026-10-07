import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../../entities/cliente.entity';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { MovimientoPuntos } from '../../entities/movimiento-puntos.entity';

export interface ResumenAdminDto {
  totalClientes: number;
  totalPuntosDisponibles: number;
  totalPuntosPendientes: number;
  totalCanjeados: number;
  totalVencidos: number;
  tendencia: 'up' | 'down' | 'flat';
  fechaActualizacion: string;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(CuentaPuntos)
    private readonly cuentaPuntosRepository: Repository<CuentaPuntos>,
    @InjectRepository(MovimientoPuntos)
    private readonly movimientoPuntosRepository: Repository<MovimientoPuntos>,
  ) {}

  async getResumen(): Promise<ResumenAdminDto> {
    const totalClientes = await this.clienteRepository.count();

    const cuentas = await this.cuentaPuntosRepository.find();

    const totalPuntosDisponibles = cuentas.reduce(
      (sum, cuenta) => sum + Number(cuenta.saldo_actual),
      0,
    );

    const totalPuntosPendientes = cuentas.reduce(
      (sum, cuenta) => sum + Number(cuenta.saldo_pendiente),
      0,
    );

    const resultadoCanjeados = await this.movimientoPuntosRepository
      .createQueryBuilder('movimiento')
      .select('SUM(ABS(movimiento.cantidad))', 'total')
      .where('movimiento.tipo_movimiento = :tipo', { tipo: 'CANJE' })
      .getRawOne();

    const totalCanjeados = parseFloat(resultadoCanjeados?.total || '0');

    const now = new Date();
    const fecha30DiasAtras = new Date(now);
    fecha30DiasAtras.setDate(fecha30DiasAtras.getDate() - 30);

    const resultadoVencidos = await this.movimientoPuntosRepository
      .createQueryBuilder('movimiento')
      .select('SUM(ABS(movimiento.cantidad))', 'total')
      .where('movimiento.tipo_movimiento = :tipo', { tipo: 'VENCIMIENTO' })
      .getRawOne();

    const totalVencidos = parseFloat(resultadoVencidos?.total || '0');

    const fecha60DiasAtras = new Date(now);
    fecha60DiasAtras.setDate(fecha60DiasAtras.getDate() - 60);
    const fecha90DiasAtras = new Date(now);
    fecha90DiasAtras.setDate(fecha90DiasAtras.getDate() - 90);

    const resultadoCanjeadosMesAnterior = await this.movimientoPuntosRepository
      .createQueryBuilder('movimiento')
      .select('SUM(ABS(movimiento.cantidad))', 'total')
      .where('movimiento.tipo_movimiento = :tipo', { tipo: 'CANJE' })
      .andWhere('movimiento.fecha_movimiento >= :fechaDesde', { fechaDesde: fecha60DiasAtras })
      .andWhere('movimiento.fecha_movimiento < :fechaHasta', { fechaHasta: fecha30DiasAtras })
      .getRawOne();

    const resultadoCanjeadosMesActual = await this.movimientoPuntosRepository
      .createQueryBuilder('movimiento')
      .select('SUM(ABS(movimiento.cantidad))', 'total')
      .where('movimiento.tipo_movimiento = :tipo', { tipo: 'CANJE' })
      .andWhere('movimiento.fecha_movimiento >= :fechaDesde', { fechaDesde: fecha30DiasAtras })
      .getRawOne();

    const canjeadosMesAnterior = parseFloat(resultadoCanjeadosMesAnterior?.total || '0');
    const canjeadosMesActual = parseFloat(resultadoCanjeadosMesActual?.total || '0');

    let tendencia: 'up' | 'down' | 'flat' = 'flat';
    if (canjeadosMesActual > canjeadosMesAnterior) {
      tendencia = 'up';
    } else if (canjeadosMesActual < canjeadosMesAnterior) {
      tendencia = 'down';
    }

    return {
      totalClientes,
      totalPuntosDisponibles: Math.round(totalPuntosDisponibles * 100) / 100,
      totalPuntosPendientes: Math.round(totalPuntosPendientes * 100) / 100,
      totalCanjeados: Math.round(totalCanjeados * 100) / 100,
      totalVencidos: Math.round(totalVencidos * 100) / 100,
      tendencia,
      fechaActualizacion: new Date().toISOString(),
    };
  }
}
