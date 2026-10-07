import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { ReservaPuntos } from '../../entities/reserva-puntos.entity';
import { ClientesService } from '../clientes/clientes.service';
import { ReservasPuntosService } from '../reservas-puntos/reservas-puntos.service';
import { RedisService } from '../redis/redis.service';
import { AplicarPuntosRequestDto, AplicarPuntosResponseDto } from './dto/aplicar-puntos.dto';

const TASA_CONVERSION_PUNTOS_COP = 100;

@Injectable()
export class AplicacionPuntosService {
  constructor(
    @InjectRepository(CuentaPuntos)
    private readonly cuentaPuntosRepository: Repository<CuentaPuntos>,
    @InjectRepository(ReservaPuntos)
    private readonly reservaRepository: Repository<ReservaPuntos>,
    private readonly clientesService: ClientesService,
    private readonly reservasPuntosService: ReservasPuntosService,
    private readonly redisService: RedisService,
  ) {}

  async aplicarPuntos(dto: AplicarPuntosRequestDto): Promise<AplicarPuntosResponseDto> {
    const cliente = await this.clientesService.findOne(dto.cliente_id);

    let cuenta = await this.cuentaPuntosRepository.findOne({
      where: { cliente_id: dto.cliente_id },
    });

    if (!cuenta) {
      throw new NotFoundException(`No se encontró cuenta de puntos para el cliente ${dto.cliente_id}`);
    }

    const saldoDisponible = Number(cuenta.saldo_actual);

    if (saldoDisponible < dto.puntos_a_usar) {
      throw new BadRequestException(
        `Saldo de puntos insuficiente. Disponible: ${saldoDisponible}, Solicitado: ${dto.puntos_a_usar}`,
      );
    }

    const reservasActivas = await this.reservasPuntosService.getReservasActivas(cuenta.cuenta_id);
    const puntosReservados = reservasActivas.reduce((sum, r) => sum + Number(r.cantidad_reservada), 0);
    const saldoReservable = saldoDisponible - puntosReservados;

    if (saldoReservable < dto.puntos_a_usar) {
      throw new BadRequestException(
        `Saldo de puntos no disponible para reserva. Disponible: ${saldoReservable}, Solicitado: ${dto.puntos_a_usar}`,
      );
    }

    const reserva = await this.reservasPuntosService.create({
      cuenta_id: cuenta.cuenta_id,
      cantidad_reservada: dto.puntos_a_usar,
    });

    const descuentoCop = dto.puntos_a_usar * TASA_CONVERSION_PUNTOS_COP;

    await this.redisService.set(
      `aplicacion:${reserva.reserva_id}`,
      JSON.stringify({
        cliente_id: dto.cliente_id,
        compra_id: dto.compra_id,
        puntos_aplicados: dto.puntos_a_usar,
        descuento_cop: descuentoCop,
        fecha_aplicacion: new Date().toISOString(),
      }),
      15 * 60,
    );

    return {
      reserva_id: reserva.reserva_id,
      cuenta_id: cuenta.cuenta_id,
      cantidad_reservada: dto.puntos_a_usar,
      descuento_cop: descuentoCop,
      estado: reserva.estado,
      fecha_reserva: reserva.fecha_reserva,
    };
  }

  async consultarDescuentoPosible(clienteId: string, puntos: number): Promise<{ descuento_cop: number; viable: boolean; mensaje?: string }> {
    let cuenta: CuentaPuntos;

    try {
      cuenta = await this.clientesService.getCuentaPuntos(clienteId);
    } catch {
      return {
        descuento_cop: 0,
        viable: false,
        mensaje: 'No se encontró cuenta de puntos para el cliente',
      };
    }

    const saldoDisponible = Number(cuenta.saldo_actual);

    if (saldoDisponible < puntos) {
      return {
        descuento_cop: 0,
        viable: false,
        mensaje: `Saldo insuficiente. Disponible: ${saldoDisponible}, Solicitado: ${puntos}`,
      };
    }

    const reservasActivas = await this.reservasPuntosService.getReservasActivas(cuenta.cuenta_id);
    const puntosReservados = reservasActivas.reduce((sum, r) => sum + Number(r.cantidad_reservada), 0);
    const saldoReservable = saldoDisponible - puntosReservados;

    if (saldoReservable < puntos) {
      return {
        descuento_cop: 0,
        viable: false,
        mensaje: `Puntos no disponibles (ya reservados: ${puntosReservados}). Solicitado: ${puntos}`,
      };
    }

    return {
      descuento_cop: puntos * TASA_CONVERSION_PUNTOS_COP,
      viable: true,
    };
  }

  async confirmarAplicacion(reservaId: string): Promise<ReservaPuntos> {
    return this.reservasPuntosService.confirmar(reservaId);
  }

  async cancelarAplicacion(reservaId: string): Promise<ReservaPuntos> {
    return this.reservasPuntosService.cancelar(reservaId, 'Aplicación de puntos cancelada');
  }

  async liberarReservasPorPagoFallido(clienteId: string, reservaIds: string[]): Promise<void> {
    const cuenta = await this.cuentaPuntosRepository.findOne({
      where: { cliente_id: clienteId },
    });
    if (!cuenta) {
      return;
    }
    await this.reservasPuntosService.liberarReservasPorFallido(
      cuenta.cuenta_id,
      reservaIds,
    );
  }
}
