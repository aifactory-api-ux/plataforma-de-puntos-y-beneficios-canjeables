import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AplicacionPuntosService } from './aplicacion-puntos.service';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { ReservaPuntos, EstadoReserva } from '../../entities/reserva-puntos.entity';
import { ClientesService } from '../clientes/clientes.service';
import { ReservasPuntosService } from '../reservas-puntos/reservas-puntos.service';
import { RedisService } from '../redis/redis.service';

describe('AplicacionPuntosService', () => {
  let service: AplicacionPuntosService;
  let cuentaPuntosRepository: jest.Mocked<Repository<CuentaPuntos>>;
  let reservaRepository: jest.Mocked<Repository<ReservaPuntos>>;
  let clientesService: jest.Mocked<ClientesService>;
  let reservasPuntosService: jest.Mocked<ReservasPuntosService>;
  let redisService: jest.Mocked<RedisService>;

  const mockCliente = {
    cliente_id: 'cliente-456',
    nombre: 'Juan Perez',
    email: 'juan@example.com',
    fecha_registro: new Date().toISOString(),
  };

  const mockCuentaPuntos: CuentaPuntos = {
    cuenta_id: 'cuenta-123',
    cliente_id: 'cliente-456',
    saldo_actual: 500,
    saldo_pendiente: 0,
    fecha_creacion: new Date().toISOString(),
    fecha_actualizacion: new Date().toISOString(),
    cliente: null as any,
  };

  const mockReservaPuntos: ReservaPuntos = {
    reserva_id: 'reserva-789',
    cuenta_id: 'cuenta-123',
    cantidad_reservada: 200,
    fecha_reserva: new Date().toISOString(),
    estado: 'PENDIENTE' as EstadoReserva,
    cuenta: null as any,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AplicacionPuntosService,
        {
          provide: getRepositoryToken(CuentaPuntos),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ReservaPuntos),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: ClientesService,
          useValue: {
            findOne: jest.fn(),
            getCuentaPuntos: jest.fn(),
          },
        },
        {
          provide: ReservasPuntosService,
          useValue: {
            create: jest.fn(),
            getReservasActivas: jest.fn(),
            confirmar: jest.fn(),
            cancelar: jest.fn(),
            liberarReservasPorFallido: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AplicacionPuntosService>(AplicacionPuntosService);
    cuentaPuntosRepository = module.get(getRepositoryToken(CuentaPuntos));
    reservaRepository = module.get(getRepositoryToken(ReservaPuntos));
    clientesService = module.get(ClientesService);
    reservasPuntosService = module.get(ReservasPuntosService);
    redisService = module.get(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('aplicarPuntos', () => {
    it('debe crear reserva y retornar datos del descuento cuando hay saldo suficiente', async () => {
      const dto = { cliente_id: 'cliente-456', compra_id: 'compra-001', puntos_a_usar: 200 };

      clientesService.findOne.mockResolvedValue(mockCliente as any);
      cuentaPuntosRepository.findOne.mockResolvedValue(mockCuentaPuntos);
      reservasPuntosService.getReservasActivas.mockResolvedValue([]);
      reservasPuntosService.create.mockResolvedValue(mockReservaPuntos);

      const result = await service.aplicarPuntos(dto);

      expect(result.reserva_id).toBe('reserva-789');
      expect(result.descuento_cop).toBe(20000);
      expect(result.cantidad_reservada).toBe(200);
      expect(result.estado).toBe('PENDIENTE');
      expect(reservasPuntosService.create).toHaveBeenCalledWith({
        cuenta_id: 'cuenta-123',
        cantidad_reservada: 200,
      });
      expect(redisService.set).toHaveBeenCalledWith(
        'aplicacion:reserva-789',
        expect.any(String),
        15 * 60,
      );
    });

    it('debe lanzar NotFoundException si el cliente no existe', async () => {
      const dto = { cliente_id: 'cliente-inexistente', compra_id: 'compra-001', puntos_a_usar: 200 };

      clientesService.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.aplicarPuntos(dto)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar NotFoundException si la cuenta no existe', async () => {
      const dto = { cliente_id: 'cliente-456', compra_id: 'compra-001', puntos_a_usar: 200 };

      clientesService.findOne.mockResolvedValue(mockCliente as any);
      cuentaPuntosRepository.findOne.mockResolvedValue(null);

      await expect(service.aplicarPuntos(dto)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar BadRequestException si el saldo es insuficiente', async () => {
      const dto = { cliente_id: 'cliente-456', compra_id: 'compra-001', puntos_a_usar: 600 };

      clientesService.findOne.mockResolvedValue(mockCliente as any);
      cuentaPuntosRepository.findOne.mockResolvedValue(mockCuentaPuntos);
      reservasPuntosService.getReservasActivas.mockResolvedValue([]);

      await expect(service.aplicarPuntos(dto)).rejects.toThrow(BadRequestException);
    });

    it('debe considerar puntos ya reservados al validar disponibilidad', async () => {
      const dto = { cliente_id: 'cliente-456', compra_id: 'compra-001', puntos_a_usar: 400 };
      const reservasActivas = [
        { ...mockReservaPuntos, reserva_id: 'reserva-1', cantidad_reservada: 200 },
      ];

      clientesService.findOne.mockResolvedValue(mockCliente as any);
      cuentaPuntosRepository.findOne.mockResolvedValue(mockCuentaPuntos);
      reservasPuntosService.getReservasActivas.mockResolvedValue(reservasActivas);

      await expect(service.aplicarPuntos(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('consultarDescuentoPosible', () => {
    it('debe retornar descuento viable cuando hay saldo suficiente', async () => {
      clientesService.getCuentaPuntos.mockResolvedValue(mockCuentaPuntos);
      reservasPuntosService.getReservasActivas.mockResolvedValue([]);

      const result = await service.consultarDescuentoPosible('cliente-456', 200);

      expect(result.descuento_cop).toBe(20000);
      expect(result.viable).toBe(true);
    });

    it('debe retornar no viable cuando no existe la cuenta', async () => {
      clientesService.getCuentaPuntos.mockRejectedValue(new Error('Not found'));

      const result = await service.consultarDescuentoPosible('cliente-inexistente', 200);

      expect(result.viable).toBe(false);
      expect(result.mensaje).toContain('No se encontró cuenta');
    });

    it('debe retornar no viable cuando el saldo es insuficiente', async () => {
      clientesService.getCuentaPuntos.mockResolvedValue(mockCuentaPuntos);
      reservasPuntosService.getReservasActivas.mockResolvedValue([]);

      const result = await service.consultarDescuentoPosible('cliente-456', 600);

      expect(result.viable).toBe(false);
      expect(result.mensaje).toContain('Saldo insuficiente');
    });

    it('debe considerar puntos reservados en la consulta', async () => {
      const reservasActivas = [
        { ...mockReservaPuntos, reserva_id: 'reserva-1', cantidad_reservada: 350 },
      ];

      clientesService.getCuentaPuntos.mockResolvedValue(mockCuentaPuntos);
      reservasPuntosService.getReservasActivas.mockResolvedValue(reservasActivas);

      const result = await service.consultarDescuentoPosible('cliente-456', 200);

      expect(result.viable).toBe(false);
      expect(result.mensaje).toContain('ya reservados');
    });
  });

  describe('confirmarAplicacion', () => {
    it('debe delegar confirmacion al ReservasPuntosService', async () => {
      const reservaConfirmada = { ...mockReservaPuntos, estado: 'CONFIRMADA' as EstadoReserva };
      reservasPuntosService.confirmar.mockResolvedValue(reservaConfirmada);

      const result = await service.confirmarAplicacion('reserva-789');

      expect(result.estado).toBe('CONFIRMADA');
      expect(reservasPuntosService.confirmar).toHaveBeenCalledWith('reserva-789');
    });
  });

  describe('cancelarAplicacion', () => {
    it('debe delegar cancelacion al ReservasPuntosService con motivo', async () => {
      const reservaCancelada = { ...mockReservaPuntos, estado: 'CANCELADA' as EstadoReserva };
      reservasPuntosService.cancelar.mockResolvedValue(reservaCancelada);

      const result = await service.cancelarAplicacion('reserva-789');

      expect(result.estado).toBe('CANCELADA');
      expect(reservasPuntosService.cancelar).toHaveBeenCalledWith('reserva-789', 'Aplicación de puntos cancelada');
    });
  });

  describe('liberarReservasPorPagoFallido', () => {
    it('debe liberar reservas cuando la cuenta existe', async () => {
      cuentaPuntosRepository.findOne.mockResolvedValue(mockCuentaPuntos);

      await service.liberarReservasPorPagoFallido('cliente-456', ['reserva-1', 'reserva-2']);

      expect(reservasPuntosService.liberarReservasPorFallido).toHaveBeenCalledWith(
        'cuenta-123',
        ['reserva-1', 'reserva-2'],
      );
    });

    it('debe no hacer nada si la cuenta no existe', async () => {
      cuentaPuntosRepository.findOne.mockResolvedValue(null);

      await service.liberarReservasPorPagoFallido('cliente-inexistente', ['reserva-1']);

      expect(reservasPuntosService.liberarReservasPorFallido).not.toHaveBeenCalled();
    });
  });
});
