import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { ReservasPuntosService } from './reservas-puntos.service';
import { ReservaPuntos, EstadoReserva } from '../../entities/reserva-puntos.entity';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { MovimientoPuntos } from '../../entities/movimiento-puntos.entity';
import { RedisService } from '../redis/redis.service';

describe('ReservasPuntosService', () => {
  let service: ReservasPuntosService;
  let reservaRepository: jest.Mocked<Repository<ReservaPuntos>>;
  let cuentaPuntosRepository: jest.Mocked<Repository<CuentaPuntos>>;
  let movimientoPuntosRepository: jest.Mocked<Repository<MovimientoPuntos>>;
  let redisService: jest.Mocked<RedisService>;
  let dataSource: jest.Mocked<DataSource>;
  let queryRunner: any;

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
    cantidad_reservada: 100,
    fecha_reserva: new Date().toISOString(),
    estado: 'PENDIENTE' as EstadoReserva,
    cuenta: null as any,
  };

  beforeEach(async () => {
    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn((entity, data) => ({ ...data })),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservasPuntosService,
        {
          provide: getRepositoryToken(ReservaPuntos),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CuentaPuntos),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(MovimientoPuntos),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            zadd: jest.fn(),
            zrangebyscore: jest.fn(),
            zremrangebyscore: jest.fn(),
            getRawClient: jest.fn().mockReturnValue({
              keys: jest.fn(),
            }),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(queryRunner),
          },
        },
      ],
    }).compile();

    service = module.get<ReservasPuntosService>(ReservasPuntosService);
    reservaRepository = module.get(getRepositoryToken(ReservaPuntos));
    cuentaPuntosRepository = module.get(getRepositoryToken(CuentaPuntos));
    movimientoPuntosRepository = module.get(getRepositoryToken(MovimientoPuntos));
    redisService = module.get(RedisService);
    dataSource = module.get(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear una reserva exitosamente cuando hay saldo suficiente', async () => {
      const createDto = { cuenta_id: 'cuenta-123', cantidad_reservada: 100 };

      queryRunner.manager.findOne.mockResolvedValueOnce(mockCuentaPuntos);
      queryRunner.manager.save.mockImplementation((entity: any, data: any) => ({
        ...data,
        reserva_id: 'reserva-789',
        estado: 'PENDIENTE',
        fecha_reserva: new Date().toISOString(),
      }));

      redisService.zrangebyscore.mockResolvedValue([]);

      const result = await service.create(createDto);

      expect(result.cuenta_id).toBe('cuenta-123');
      expect(result.cantidad_reservada).toBe(100);
      expect(result.estado).toBe('PENDIENTE');
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si la cuenta no existe', async () => {
      const createDto = { cuenta_id: 'cuenta-inexistente', cantidad_reservada: 100 };

      queryRunner.manager.findOne.mockResolvedValueOnce(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('debe lanzar BadRequestException si el saldo es insuficiente', async () => {
      const createDto = { cuenta_id: 'cuenta-123', cantidad_reservada: 600 };

      queryRunner.manager.findOne.mockResolvedValueOnce({ ...mockCuentaPuntos, saldo_actual: 500 });
      redisService.zrangebyscore.mockResolvedValue([]);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('debe considerar reservas activas al calcular saldo disponible', async () => {
      const createDto = { cuenta_id: 'cuenta-123', cantidad_reservada: 350 };

      queryRunner.manager.findOne.mockResolvedValueOnce({ ...mockCuentaPuntos, saldo_actual: 500 });
      redisService.zrangebyscore.mockResolvedValue(['reserva-1', 'reserva-2']);
      redisService.get
        .mockResolvedValueOnce(JSON.stringify({ reserva_id: 'reserva-1', cantidad_reservada: 100, estado: 'PENDIENTE' }))
        .mockResolvedValueOnce(JSON.stringify({ reserva_id: 'reserva-2', cantidad_reservada: 100, estado: 'PENDIENTE' }));

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('debe retornar reserva desde Redis si esta en cache', async () => {
      const cachedData = {
        reserva_id: 'reserva-789',
        cuenta_id: 'cuenta-123',
        cantidad_reservada: 100,
        estado: 'PENDIENTE',
        fecha_reserva: new Date().toISOString(),
      };

      redisService.get.mockResolvedValue(JSON.stringify(cachedData));

      const result = await service.findOne('reserva-789');

      expect(result.reserva_id).toBe('reserva-789');
      expect(reservaRepository.findOne).not.toHaveBeenCalled();
    });

    it('debe buscar en BD si no esta en Redis', async () => {
      redisService.get.mockResolvedValue(null);
      reservaRepository.findOne.mockResolvedValue(mockReservaPuntos);

      const result = await service.findOne('reserva-789');

      expect(result.reserva_id).toBe('reserva-789');
      expect(reservaRepository.findOne).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si la reserva no existe', async () => {
      redisService.get.mockResolvedValue(null);
      reservaRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('reserva-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  describe('confirmar', () => {
    it('debe confirmar una reserva PENDIENTE exitosamente', async () => {
      const reservaPendiente = { ...mockReservaPuntos, estado: 'PENDIENTE' as EstadoReserva };
      const cuentaConSaldo = { ...mockCuentaPuntos, saldo_actual: 500 };

      queryRunner.manager.findOne
        .mockResolvedValueOnce(reservaPendiente)
        .mockResolvedValueOnce(cuentaConSaldo);
      queryRunner.manager.save
        .mockResolvedValueOnce({ ...reservaPendiente, estado: 'CONFIRMADA' })
        .mockResolvedValueOnce({ ...cuentaConSaldo, saldo_actual: 400 });

      const result = await service.confirmar('reserva-789');

      expect(result.estado).toBe('CONFIRMADA');
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(redisService.del).toHaveBeenCalled();
    });

    it('debe lanzar ConflictException si la reserva no esta PENDIENTE', async () => {
      const reservaConfirmada = { ...mockReservaPuntos, estado: 'CONFIRMADA' as EstadoReserva };
      queryRunner.manager.findOne.mockResolvedValueOnce(reservaConfirmada);

      await expect(service.confirmar('reserva-789')).rejects.toThrow(ConflictException);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('debe lanzar BadRequestException si el saldo es insuficiente para confirmar', async () => {
      const reservaPendiente = { ...mockReservaPuntos, estado: 'PENDIENTE' as EstadoReserva };
      const cuentaConSaldoInsuficiente = { ...mockCuentaPuntos, saldo_actual: 50 };

      queryRunner.manager.findOne
        .mockResolvedValueOnce(reservaPendiente)
        .mockResolvedValueOnce(cuentaConSaldoInsuficiente);

      await expect(service.confirmar('reserva-789')).rejects.toThrow(BadRequestException);
    });

    it('debe crear movimiento de CANJE al confirmar', async () => {
      const reservaPendiente = { ...mockReservaPuntos, estado: 'PENDIENTE' as EstadoReserva };
      const cuentaConSaldo = { ...mockCuentaPuntos, saldo_actual: 500 };

      queryRunner.manager.findOne
        .mockResolvedValueOnce(reservaPendiente)
        .mockResolvedValueOnce(cuentaConSaldo);
      queryRunner.manager.save
        .mockResolvedValueOnce({ ...reservaPendiente, estado: 'CONFIRMADA' })
        .mockResolvedValueOnce({ ...cuentaConSaldo, saldo_actual: 400 });

      await service.confirmar('reserva-789');

      expect(movimientoPuntosRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          tipo_movimiento: 'CANJE',
          cantidad: -100,
        }),
      );
    });
  });

  describe('cancelar', () => {
    it('debe cancelar una reserva PENDIENTE exitosamente', async () => {
      const reservaPendiente = { ...mockReservaPuntos, estado: 'PENDIENTE' as EstadoReserva };

      queryRunner.manager.findOne.mockResolvedValueOnce(reservaPendiente);
      queryRunner.manager.save.mockResolvedValueOnce({ ...reservaPendiente, estado: 'CANCELADA' });

      const result = await service.cancelar('reserva-789', 'Motivo de prueba');

      expect(result.estado).toBe('CANCELADA');
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('debe lanzar ConflictException si la reserva no esta PENDIENTE', async () => {
      const reservaCancelada = { ...mockReservaPuntos, estado: 'CANCELADA' as EstadoReserva };
      queryRunner.manager.findOne.mockResolvedValueOnce(reservaCancelada);

      await expect(service.cancelar('reserva-789')).rejects.toThrow(ConflictException);
    });

    it('debe limpiar Redis al cancelar', async () => {
      const reservaPendiente = { ...mockReservaPuntos, estado: 'PENDIENTE' as EstadoReserva };
      queryRunner.manager.findOne.mockResolvedValueOnce(reservaPendiente);
      queryRunner.manager.save.mockResolvedValueOnce({ ...mockReservaPuntos, estado: 'CANCELADA' });

      await service.cancelar('reserva-789');

      expect(redisService.del).toHaveBeenCalled();
      expect(redisService.zremrangebyscore).toHaveBeenCalled();
    });
  });

  describe('liberarReservasPorFallido', () => {
    it('debe liberar las reservas pendientes por pago fallido', async () => {
      const reservaPendiente = { ...mockReservaPuntos, estado: 'PENDIENTE' as EstadoReserva };

      queryRunner.manager.findOne.mockResolvedValueOnce(reservaPendiente);
      queryRunner.manager.save.mockResolvedValueOnce({ ...mockReservaPuntos, estado: 'CANCELADA' });

      await service.liberarReservasPorFallido('cuenta-123', ['reserva-789']);

      expect(redisService.del).toHaveBeenCalled();
    });
  });

  describe('getReservasActivas', () => {
    it('debe combinar reservas de BD y Redis filtrando por estado', async () => {
      const reservasDb: Partial<ReservaPuntos>[] = [
        { ...mockReservaPuntos, reserva_id: 'reserva-1' },
        { ...mockReservaPuntos, reserva_id: 'reserva-2' },
        { ...mockReservaPuntos, reserva_id: 'reserva-3' },
      ];

      reservaRepository.find.mockResolvedValue(reservasDb as ReservaPuntos[]);
      redisService.zrangebyscore.mockResolvedValue(['reserva-1', 'reserva-2']);
      redisService.get
        .mockResolvedValueOnce(JSON.stringify({ reserva_id: 'reserva-1', cantidad_reservada: 100, estado: 'PENDIENTE' }))
        .mockResolvedValueOnce(JSON.stringify({ reserva_id: 'reserva-2', cantidad_reservada: 200, estado: 'PENDIENTE' }));

      const result = await service.getReservasActivas('cuenta-123');

      expect(result.length).toBe(2);
    });
  });
});
