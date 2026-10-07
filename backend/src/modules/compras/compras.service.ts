import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Compra } from '../../entities/compra.entity';
import { LineaCompra } from '../../entities/linea-compra.entity';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { MovimientoPuntos } from '../../entities/movimiento-puntos.entity';
import { Auditoria } from '../../entities/auditoria.entity';
import { Devolucion } from '../../entities/devolucion.entity';
import { CreateCompraDto } from './dto/create-compra.dto';
import { ConfirmarEntregaDto } from './dto/confirmar-entrega.dto';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { ReglasPuntosService } from '../reglas-puntos/reglas-puntos.service';

@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
    @InjectRepository(LineaCompra)
    private readonly lineaCompraRepository: Repository<LineaCompra>,
    @InjectRepository(CuentaPuntos)
    private readonly cuentaPuntosRepository: Repository<CuentaPuntos>,
    @InjectRepository(MovimientoPuntos)
    private readonly movimientoPuntosRepository: Repository<MovimientoPuntos>,
    @InjectRepository(Auditoria)
    private readonly auditoriaRepository: Repository<Auditoria>,
    private readonly dataSource: DataSource,
    private readonly reglasPuntosService: ReglasPuntosService,
  ) {}

  async create(createCompraDto: CreateCompraDto): Promise<Compra & { lineas: LineaCompra[] }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cuenta = await queryRunner.manager.findOne(CuentaPuntos, {
        where: { cliente_id: createCompraDto.cliente_id },
      });

      if (!cuenta) {
        throw new NotFoundException(
          `No se encontró cuenta de puntos para el cliente ${createCompraDto.cliente_id}`,
        );
      }

      const tasaPuntos = await this.reglasPuntosService.obtenerTasaPuntosActiva();

      const montoTotal = createCompraDto.lineas.reduce(
        (sum, linea) => sum + linea.precio_unitario * linea.cantidad,
        0,
      );

      const compra = queryRunner.manager.create(Compra, {
        compra_id: uuidv4(),
        cliente_id: createCompraDto.cliente_id,
        canal_venta: createCompraDto.canal_venta,
        estado: 'PENDIENTE',
        monto_total: montoTotal,
      });
      await queryRunner.manager.save(compra);

      const lineasGuardadas: LineaCompra[] = [];

      for (const lineaDto of createCompraDto.lineas) {
        const puntosAcumulados = this.reglasPuntosService.calcularPuntosPorLinea(
          lineaDto.precio_unitario,
          lineaDto.cantidad,
          tasaPuntos,
        );

        const linea = queryRunner.manager.create(LineaCompra, {
          linea_id: uuidv4(),
          compra_id: compra.compra_id,
          producto_id: lineaDto.producto_id,
          cantidad: lineaDto.cantidad,
          precio_unitario: lineaDto.precio_unitario,
          puntos_acumulados: puntosAcumulados,
        });
        const lineaGuardada = await queryRunner.manager.save(linea);
        lineasGuardadas.push(lineaGuardada);

        const movimiento = queryRunner.manager.create(MovimientoPuntos, {
          movimiento_id: uuidv4(),
          cuenta_id: cuenta.cuenta_id,
          tipo_movimiento: 'ACUMULACION',
          cantidad: puntosAcumulados,
          fecha_movimiento: new Date().toISOString(),
          origen: compra.compra_id,
          regla_aplicada_id: tasaPuntos?.regla_id,
        });
        await queryRunner.manager.save(movimiento);
      }

      cuenta.saldo_pendiente = Number(cuenta.saldo_pendiente) + lineasGuardadas.reduce(
        (sum, l) => sum + Number(l.puntos_acumulados),
        0,
      );
      await queryRunner.manager.save(cuenta);

      await queryRunner.commitTransaction();

      return {
        ...compra,
        lineas: lineasGuardadas,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(compraId: string): Promise<Compra & { lineas: LineaCompra[] }> {
    const compra = await this.compraRepository.findOne({
      where: { compra_id: compraId },
      relations: ['lineas'],
    });

    if (!compra) {
      throw new NotFoundException(`Compra con ID ${compraId} no encontrada`);
    }

    return compra;
  }

  async confirmarEntrega(compraId: string, _confirmarEntregaDto: ConfirmarEntregaDto): Promise<Compra> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const compra = await queryRunner.manager.findOne(Compra, {
        where: { compra_id: compraId },
        relations: ['lineas'],
      });

      if (!compra) {
        throw new NotFoundException(`Compra con ID ${compraId} no encontrada`);
      }

      if (compra.estado === 'ENTREGADA') {
        throw new BadRequestException('La compra ya ha sido entregada');
      }

      const cuenta = await queryRunner.manager.findOne(CuentaPuntos, {
        where: { cliente_id: compra.cliente_id },
      });

      if (!cuenta) {
        throw new NotFoundException(`No se encontró cuenta de puntos para el cliente ${compra.cliente_id}`);
      }

      const puntosALiberar = compra.lineas.reduce(
        (sum, linea) => sum + Number(linea.puntos_acumulados),
        0,
      );

      compra.estado = 'ENTREGADA';
      await queryRunner.manager.save(compra);

      cuenta.saldo_actual = Number(cuenta.saldo_actual) + puntosALiberar;
      cuenta.saldo_pendiente = Number(cuenta.saldo_pendiente) - puntosALiberar;
      await queryRunner.manager.save(cuenta);

      const movimiento = queryRunner.manager.create(MovimientoPuntos, {
        movimiento_id: uuidv4(),
        cuenta_id: cuenta.cuenta_id,
        tipo_movimiento: 'ACUMULACION',
        cantidad: puntosALiberar,
        fecha_movimiento: new Date().toISOString(),
        origen: compra.compra_id,
        regla_aplicada_id: undefined,
      });
      await queryRunner.manager.save(movimiento);

      await queryRunner.commitTransaction();

      return this.findOne(compraId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async crearDevolucion(compraId: string, createDevolucionDto: CreateDevolucionDto): Promise<Devolucion> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const compra = await queryRunner.manager.findOne(Compra, {
        where: { compra_id: compraId },
        relations: ['lineas'],
      });

      if (!compra) {
        throw new NotFoundException(`Compra con ID ${compraId} no encontrada`);
      }

      if (compra.estado !== 'ENTREGADA') {
        throw new BadRequestException('La compra no ha sido entregada, no se puede devolver');
      }

      const cuenta = await queryRunner.manager.findOne(CuentaPuntos, {
        where: { cliente_id: compra.cliente_id },
      });

      if (!cuenta) {
        throw new NotFoundException(`No se encontró cuenta de puntos para el cliente ${compra.cliente_id}`);
      }

      const puntosADevolver = compra.lineas.reduce(
        (sum, linea) => sum + Number(linea.puntos_acumulados),
        0,
      );

      const devolucion = queryRunner.manager.create(Devolucion, {
        devolucion_id: uuidv4(),
        compra_id: compraId,
        monto_devolucion: createDevolucionDto.monto_devolucion,
      });
      await queryRunner.manager.save(devolucion);

      cuenta.saldo_actual = Number(cuenta.saldo_actual) - puntosADevolver;
      await queryRunner.manager.save(cuenta);

      const movimiento = queryRunner.manager.create(MovimientoPuntos, {
        movimiento_id: uuidv4(),
        cuenta_id: cuenta.cuenta_id,
        tipo_movimiento: 'DEVOLUCION',
        cantidad: -puntosADevolver,
        fecha_movimiento: new Date().toISOString(),
        origen: devolucion.devolucion_id,
        regla_aplicada_id: undefined,
      });
      await queryRunner.manager.save(movimiento);

      await queryRunner.commitTransaction();

      return devolucion;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findByCliente(clienteId: string): Promise<Compra[]> {
    return this.compraRepository.find({
      where: { cliente_id: clienteId },
      relations: ['lineas'],
      order: { fecha_compra: 'DESC' },
    });
  }
}
