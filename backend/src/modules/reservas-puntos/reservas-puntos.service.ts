import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ReservaPuntos, EstadoReserva } from '../../entities/reserva-puntos.entity';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { MovimientoPuntos } from '../../entities/movimiento-puntos.entity';
import { RedisService } from '../redis/redis.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { Logger } from '@nestjs/common';

const RESERVA_TTL_SECONDS = 15 * 60;

@Injectable()
export class ReservasPuntosService {
  private readonly logger = new Logger(ReservasPuntosService.name);
  constructor(
    @InjectRepository(ReservaPuntos)
    private readonly reservaRepository: Repository<ReservaPuntos>,
    @InjectRepository(CuentaPuntos)
    private readonly cuentaPuntosRepository: Repository<CuentaPuntos>,
    @InjectRepository(MovimientoPuntos)
    private readonly movimientoPuntosRepository: Repository<MovimientoPuntos>,
    private readonly redisService: RedisService,
    private readonly dataSource: DataSource,
  ) {}

  private getRedisKey(cuentaId: string): string {
    return `reserva:puntos:${cuentaId}`;
  }

  private getReservaRedisKey(reservaId: string): string {
    return `reserva:datos:${reservaId}`;
  }

  async create(createReservaDto: CreateReservaDto): Promise<ReservaPuntos> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cuenta = await queryRunner.manager.findOne(CuentaPuntos, {
        where: { cuenta_id: createReservaDto.cuenta_id },
      });

      if (!cuenta) {
        throw new NotFoundException(`Cuenta de puntos con ID ${createReservaDto.cuenta_id} no encontrada`);
      }

      const saldoDisponible = Number(cuenta.saldo_actual);

      const reservasActivas = await this.getReservasActivasRedis(createReservaDto.cuenta_id);
      const puntosReservados = reservasActivas.reduce((sum, r) => sum + r.cantidad_reservada, 0);
      const saldoReservable = saldoDisponible - puntosReservados;

      if (saldoReservable < createReservaDto.cantidad_reservada) {
        throw new BadRequestException(
          `Saldo de puntos insuficiente. Disponible: ${saldoReservable}, Solicitado: ${createReservaDto.cantidad_reservada}`,
        );
      }

      const reserva = queryRunner.manager.create(ReservaPuntos, {
        reserva_id: uuidv4(),
        cuenta_id: createReservaDto.cuenta_id,
        cantidad_reservada: createReservaDto.cantidad_reservada,
        estado: 'PENDIENTE',
      });

      const savedReserva = await queryRunner.manager.save(reserva);

      await this.redisService.set(
        this.getReservaRedisKey(savedReserva.reserva_id),
        JSON.stringify({
          reserva_id: savedReserva.reserva_id,
          cuenta_id: savedReserva.cuenta_id,
          cantidad_reservada: savedReserva.cantidad_reservada,
          estado: savedReserva.estado,
          fecha_reserva: savedReserva.fecha_reserva,
        }),
        RESERVA_TTL_SECONDS,
      );

      await this.redisService.zadd(
        this.getRedisKey(createReservaDto.cuenta_id),
        Date.now() + RESERVA_TTL_SECONDS * 1000,
        savedReserva.reserva_id,
      );

      await queryRunner.commitTransaction();
      return savedReserva;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(reservaId: string): Promise<ReservaPuntos> {
    const cached = await this.redisService.get(this.getReservaRedisKey(reservaId));
    if (cached) {
      const data = JSON.parse(cached);
      const reserva = new ReservaPuntos();
      reserva.reserva_id = data.reserva_id;
      reserva.cuenta_id = data.cuenta_id;
      reserva.cantidad_reservada = data.cantidad_reservada;
      reserva.estado = data.estado;
      reserva.fecha_reserva = data.fecha_reserva;
      return reserva;
    }

    const reserva = await this.reservaRepository.findOne({
      where: { reserva_id: reservaId },
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${reservaId} no encontrada`);
    }

    return reserva;
  }

  async findByCuentaId(cuentaId: string): Promise<ReservaPuntos[]> {
    return this.reservaRepository.find({
      where: { cuenta_id: cuentaId },
      order: { fecha_reserva: 'DESC' },
    });
  }

  async findPendientesByCuentaId(cuentaId: string): Promise<ReservaPuntos[]> {
    return this.reservaRepository.find({
      where: { cuenta_id: cuentaId, estado: 'PENDIENTE' as EstadoReserva },
      order: { fecha_reserva: 'ASC' },
    });
  }

  async confirmar(reservaId: string): Promise<ReservaPuntos> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reserva = await queryRunner.manager.findOne(ReservaPuntos, {
        where: { reserva_id: reservaId },
      });

      if (!reserva) {
        throw new NotFoundException(`Reserva con ID ${reservaId} no encontrada`);
      }

      if (reserva.estado !== 'PENDIENTE') {
        throw new ConflictException(
          `No se puede confirmar una reserva en estado ${reserva.estado}. Solo las reservas PENDIENTE pueden confirmarse.`,
        );
      }

      const cuenta = await queryRunner.manager.findOne(CuentaPuntos, {
        where: { cuenta_id: reserva.cuenta_id },
      });

      if (!cuenta) {
        throw new NotFoundException(`Cuenta de puntos con ID ${reserva.cuenta_id} no encontrada`);
      }

      if (Number(cuenta.saldo_actual) < reserva.cantidad_reservada) {
        throw new BadRequestException('Saldo de puntos insuficiente para confirmar la reserva');
      }

      reserva.estado = 'CONFIRMADA';
      const updatedReserva = await queryRunner.manager.save(reserva);

      cuenta.saldo_actual = Number(cuenta.saldo_actual) - reserva.cantidad_reservada;
      await queryRunner.manager.save(cuenta);

      const movimientoData = {
        movimiento_id: uuidv4(),
        cuenta_id: reserva.cuenta_id,
        tipo_movimiento: 'CANJE' as const,
        cantidad: -reserva.cantidad_reservada,
        fecha_movimiento: new Date().toISOString(),
        origen: `reserva_${reservaId}`,
        regla_aplicada_id: undefined,
        auditoria_id: undefined,
      };
      await queryRunner.manager.save(MovimientoPuntos, movimientoData);

      await this.redisService.del(this.getReservaRedisKey(reservaId));
      await this.redisService.zremrangebyscore(
        this.getRedisKey(reserva.cuenta_id),
        0,
        Date.now(),
      );

      await queryRunner.commitTransaction();
      return updatedReserva;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelar(reservaId: string, motivo?: string): Promise<ReservaPuntos> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reserva = await queryRunner.manager.findOne(ReservaPuntos, {
        where: { reserva_id: reservaId },
      });

      if (!reserva) {
        throw new NotFoundException(`Reserva con ID ${reservaId} no encontrada`);
      }

      if (reserva.estado !== 'PENDIENTE') {
        throw new ConflictException(
          `No se puede cancelar una reserva en estado ${reserva.estado}. Solo las reservas PENDIENTE pueden cancelarse.`,
        );
      }

      reserva.estado = 'CANCELADA';
      const updatedReserva = await queryRunner.manager.save(reserva);

      await this.redisService.del(this.getReservaRedisKey(reservaId));
      await this.redisService.zremrangebyscore(
        this.getRedisKey(reserva.cuenta_id),
        0,
        Date.now(),
      );

      await queryRunner.commitTransaction();
      return updatedReserva;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async procesarReservasExpiradas(): Promise<number> {
    const now = Date.now();
    const redisClient = this.redisService.getRawClient();
    const keys = await redisClient.keys(this.getRedisKey('*').replace('*', ''));

    let procesadas = 0;
    for (const key of keys) {
      const reservaIds = await this.redisService.zrangebyscore(key, 0, now);
      for (const reservaId of reservaIds) {
        try {
          await this.cancelar(reservaId, 'Reserva expirada por timeout');
          procesadas++;
        } catch (error) {
          this.logger.warn(`Error al procesar reserva expirada ${reservaId}: ${error.message}`);
        }
      }
    }
    return procesadas;
  }

  private async getReservasActivasRedis(cuentaId: string): Promise<Array<{ reserva_id: string; cantidad_reservada: number }>> {
    const reservaIds = await this.redisService.zrangebyscore(this.getRedisKey(cuentaId), 0, Date.now() + RESERVA_TTL_SECONDS * 1000);
    const reservas: Array<{ reserva_id: string; cantidad_reservada: number }> = [];

    for (const reservaId of reservaIds) {
      const cached = await this.redisService.get(this.getReservaRedisKey(reservaId));
      if (cached) {
        const data = JSON.parse(cached);
        if (data.estado === 'PENDIENTE') {
          reservas.push({
            reserva_id: data.reserva_id,
            cantidad_reservada: data.cantidad_reservada,
          });
        }
      }
    }

    return reservas;
  }

  async getReservasActivas(cuentaId: string): Promise<ReservaPuntos[]> {
    const pendientes = await this.findPendientesByCuentaId(cuentaId);
    const dbReservas = pendientes.filter(r => r.estado === 'PENDIENTE');

    const redisReservas = await this.getReservasActivasRedis(cuentaId);

    const reservaIdsRedis = new Set(redisReservas.map(r => r.reserva_id));
    const reservasValidas = dbReservas.filter(r => reservaIdsRedis.has(r.reserva_id));

    return reservasValidas;
  }

  async liberarReservasPorFallido(cuentaId: string, reservaIds: string[]): Promise<void> {
    for (const reservaId of reservaIds) {
      try {
        await this.cancelar(reservaId, 'Pago fallido - liberación de reserva');
      } catch {
        // La reserva pudo haber expirado o ya estar cancelada
      }
    }
  }
}
