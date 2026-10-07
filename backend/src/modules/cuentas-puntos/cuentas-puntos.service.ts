import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { MovimientoPuntos } from '../../entities/movimiento-puntos.entity';
import { Auditoria } from '../../entities/auditoria.entity';
import { AdjustCuentaDto } from './dto/adjust-cuenta.dto';

@Injectable()
export class CuentasPuntosService {
  constructor(
    @InjectRepository(CuentaPuntos)
    private readonly cuentaPuntosRepository: Repository<CuentaPuntos>,
    @InjectRepository(MovimientoPuntos)
    private readonly movimientoPuntosRepository: Repository<MovimientoPuntos>,
    @InjectRepository(Auditoria)
    private readonly auditoriaRepository: Repository<Auditoria>,
    private readonly dataSource: DataSource,
  ) {}

  async findOne(cuentaId: string): Promise<CuentaPuntos> {
    const cuenta = await this.cuentaPuntosRepository.findOne({
      where: { cuenta_id: cuentaId },
    });

    if (!cuenta) {
      throw new NotFoundException(`Cuenta de puntos con ID ${cuentaId} no encontrada`);
    }

    return cuenta;
  }

  async findByClienteId(clienteId: string): Promise<CuentaPuntos> {
    const cuenta = await this.cuentaPuntosRepository.findOne({
      where: { cliente_id: clienteId },
    });

    if (!cuenta) {
      throw new NotFoundException(`No se encontró cuenta de puntos para el cliente ${clienteId}`);
    }

    return cuenta;
  }

  async getSaldos(cuentaId: string): Promise<{ saldo_actual: number; saldo_pendiente: number }> {
    const cuenta = await this.findOne(cuentaId);
    return {
      saldo_actual: Number(cuenta.saldo_actual),
      saldo_pendiente: Number(cuenta.saldo_pendiente),
    };
  }

  async adjust(cuentaId: string, adjustDto: AdjustCuentaDto): Promise<CuentaPuntos> {
    const cuenta = await this.findOne(cuentaId);

    const nuevoSaldo = Number(cuenta.saldo_actual) + adjustDto.cantidad;

    if (nuevoSaldo < 0) {
      throw new BadRequestException(
        `El ajuste resultaría en un saldo negativo. Saldo actual: ${cuenta.saldo_actual}, Ajuste: ${adjustDto.cantidad}`,
      );
    }

    const auditoriaId = uuidv4();
    const auditoriaData: DeepPartial<Auditoria> = {
      auditoria_id: auditoriaId,
      usuario_admin: adjustDto.usuario_admin,
      accion: 'AJUSTE_PUNTOS',
      detalles: JSON.stringify({
        cuenta_id: cuentaId,
        cantidad_anterior: Number(cuenta.saldo_actual) - adjustDto.cantidad,
        cantidad_ajustada: adjustDto.cantidad,
        nuevo_saldo: nuevoSaldo,
        motivo: adjustDto.detalles,
      }),
    };
    await this.auditoriaRepository.save(auditoriaData);

    cuenta.saldo_actual = nuevoSaldo;
    const updatedCuenta = await this.cuentaPuntosRepository.save(cuenta);

    const movimientoData: DeepPartial<MovimientoPuntos> = {
      movimiento_id: uuidv4(),
      cuenta_id: cuentaId,
      tipo_movimiento: 'AJUSTE',
      cantidad: adjustDto.cantidad,
      fecha_movimiento: new Date().toISOString(),
      origen: `ajuste_${uuidv4()}`,
      regla_aplicada_id: undefined,
      auditoria_id: auditoriaId,
    };
    await this.movimientoPuntosRepository.save(movimientoData);

    return updatedCuenta;
  }

  async updateSaldoActual(cuentaId: string, nuevoSaldo: number): Promise<CuentaPuntos> {
    const cuenta = await this.findOne(cuentaId);
    cuenta.saldo_actual = nuevoSaldo;
    return this.cuentaPuntosRepository.save(cuenta);
  }

  async updateSaldoPendiente(cuentaId: string, nuevoSaldo: number): Promise<CuentaPuntos> {
    const cuenta = await this.findOne(cuentaId);
    cuenta.saldo_pendiente = nuevoSaldo;
    return this.cuentaPuntosRepository.save(cuenta);
  }

  async agregarPuntos(cuentaId: string, cantidad: number, origen: string, reglaAplicadaId?: string): Promise<MovimientoPuntos> {
    const cuenta = await this.findOne(cuentaId);

    cuenta.saldo_actual = Number(cuenta.saldo_actual) + cantidad;
    await this.cuentaPuntosRepository.save(cuenta);

    const movimientoData: DeepPartial<MovimientoPuntos> = {
      movimiento_id: uuidv4(),
      cuenta_id: cuentaId,
      tipo_movimiento: 'ACUMULACION',
      cantidad: cantidad,
      fecha_movimiento: new Date().toISOString(),
      origen: origen,
      regla_aplicada_id: reglaAplicadaId || undefined,
      auditoria_id: undefined,
    };

    return await this.movimientoPuntosRepository.save(movimientoData);
  }

  async findMovimientosByCuentaId(cuentaId: string): Promise<MovimientoPuntos[]> {
    await this.findOne(cuentaId);
    return this.movimientoPuntosRepository.find({
      where: { cuenta_id: cuentaId },
      order: { fecha_movimiento: 'DESC' },
    });
  }

  async descontarPuntos(cuentaId: string, cantidad: number, origen: string): Promise<MovimientoPuntos> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cuenta = await queryRunner.manager.findOne(CuentaPuntos, {
        where: { cuenta_id: cuentaId },
      });

      if (!cuenta) {
        throw new NotFoundException(`Cuenta de puntos con ID ${cuentaId} no encontrada`);
      }

      if (Number(cuenta.saldo_actual) < cantidad) {
        throw new BadRequestException('Saldo de puntos insuficiente para realizar el descuento');
      }

      cuenta.saldo_actual = Number(cuenta.saldo_actual) - cantidad;
      await queryRunner.manager.save(cuenta);

      const movimientoData: DeepPartial<MovimientoPuntos> = {
        movimiento_id: uuidv4(),
        cuenta_id: cuentaId,
        tipo_movimiento: 'CANJE',
        cantidad: -cantidad,
        fecha_movimiento: new Date().toISOString(),
        origen: origen,
        regla_aplicada_id: undefined,
        auditoria_id: undefined,
      };

      const movimiento = await queryRunner.manager.save(MovimientoPuntos, movimientoData);
      await queryRunner.commitTransaction();
      return movimiento;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
