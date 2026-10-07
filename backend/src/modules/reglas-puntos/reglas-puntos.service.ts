import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ReglaPuntos } from '../../entities/regla-puntos.entity';
import { ConfiguracionRegla } from '../../entities/configuracion-regla.entity';
import { Auditoria } from '../../entities/auditoria.entity';
import { CreateReglaPuntosDto } from './dto/create-regla.dto';
import { UpdateReglaPuntosDto } from './dto/update-regla.dto';
import { CreateConfiguracionReglaDto } from './dto/create-configuracion-regla.dto';

@Injectable()
export class ReglasPuntosService {
  constructor(
    @InjectRepository(ReglaPuntos)
    private readonly reglaPuntosRepository: Repository<ReglaPuntos>,
    @InjectRepository(ConfiguracionRegla)
    private readonly configuracionReglaRepository: Repository<ConfiguracionRegla>,
    @InjectRepository(Auditoria)
    private readonly auditoriaRepository: Repository<Auditoria>,
  ) {}

  async findAll(): Promise<ReglaPuntos[]> {
    return this.reglaPuntosRepository.find({
      relations: ['configuraciones'],
      order: { version: 'DESC', fecha_vigencia_inicio: 'DESC' },
    });
  }

  async findOne(reglaId: string): Promise<ReglaPuntos> {
    const regla = await this.reglaPuntosRepository.findOne({
      where: { regla_id: reglaId },
      relations: ['configuraciones'],
    });

    if (!regla) {
      throw new NotFoundException(`Regla de puntos con ID ${reglaId} no encontrada`);
    }

    return regla;
  }

  async create(createReglaDto: CreateReglaPuntosDto): Promise<ReglaPuntos> {
    const regla = this.reglaPuntosRepository.create({
      regla_id: uuidv4(),
      nombre: createReglaDto.nombre,
      descripcion: createReglaDto.descripcion || '',
      version: createReglaDto.version,
      fecha_vigencia_inicio: createReglaDto.fecha_vigencia_inicio,
      fecha_vigencia_fin: createReglaDto.fecha_vigencia_fin,
      activa: createReglaDto.activa ?? true,
    });

    const reglaGuardada = await this.reglaPuntosRepository.save(regla);

    if (createReglaDto.configuraciones && createReglaDto.configuraciones.length > 0) {
      const configuraciones: ConfiguracionRegla[] = [];

      for (const configDto of createReglaDto.configuraciones) {
        const config = this.configuracionReglaRepository.create({
          config_id: uuidv4(),
          regla_id: reglaGuardada.regla_id,
          tipo_config: configDto.tipo_config,
          valor: configDto.valor,
          meta_data: configDto.meta_data || '',
        });
        configuraciones.push(await this.configuracionReglaRepository.save(config));
      }

      reglaGuardada.configuraciones = configuraciones;
    }

    await this.crearAuditoria({
      usuario_admin: 'SYSTEM',
      accion: 'CREACION_REGLA',
      detalles: JSON.stringify({
        regla_id: reglaGuardada.regla_id,
        nombre: reglaGuardada.nombre,
        version: reglaGuardada.version,
      }),
    });

    return reglaGuardada;
  }

  async update(reglaId: string, updateReglaDto: UpdateReglaPuntosDto): Promise<ReglaPuntos> {
    const regla = await this.findOne(reglaId);

    const cambios: Record<string, { anterior: unknown; nuevo: unknown }> = {};

    if (updateReglaDto.nombre !== undefined) {
      cambios.nombre = { anterior: regla.nombre, nuevo: updateReglaDto.nombre };
      regla.nombre = updateReglaDto.nombre;
    }
    if (updateReglaDto.descripcion !== undefined) {
      cambios.descripcion = { anterior: regla.descripcion, nuevo: updateReglaDto.descripcion };
      regla.descripcion = updateReglaDto.descripcion;
    }
    if (updateReglaDto.version !== undefined) {
      cambios.version = { anterior: regla.version, nuevo: updateReglaDto.version };
      regla.version = updateReglaDto.version;
    }
    if (updateReglaDto.fecha_vigencia_inicio !== undefined) {
      cambios.fecha_vigencia_inicio = { anterior: regla.fecha_vigencia_inicio, nuevo: updateReglaDto.fecha_vigencia_inicio };
      regla.fecha_vigencia_inicio = updateReglaDto.fecha_vigencia_inicio;
    }
    if (updateReglaDto.fecha_vigencia_fin !== undefined) {
      cambios.fecha_vigencia_fin = { anterior: regla.fecha_vigencia_fin, nuevo: updateReglaDto.fecha_vigencia_fin };
      regla.fecha_vigencia_fin = updateReglaDto.fecha_vigencia_fin;
    }
    if (updateReglaDto.activa !== undefined) {
      cambios.activa = { anterior: regla.activa, nuevo: updateReglaDto.activa };
      regla.activa = updateReglaDto.activa;
    }

    const reglaActualizada = await this.reglaPuntosRepository.save(regla);

    await this.crearAuditoria({
      usuario_admin: 'SYSTEM',
      accion: 'ACTUALIZACION_REGLA',
      detalles: JSON.stringify({
        regla_id: reglaId,
        cambios,
      }),
    });

    return reglaActualizada;
  }

  async getConfiguraciones(reglaId: string): Promise<ConfiguracionRegla[]> {
    await this.findOne(reglaId);

    return this.configuracionReglaRepository.find({
      where: { regla_id: reglaId },
    });
  }

  async createConfiguracion(
    reglaId: string,
    createConfiguracionDto: CreateConfiguracionReglaDto,
  ): Promise<ConfiguracionRegla> {
    await this.findOne(reglaId);

    const config = this.configuracionReglaRepository.create({
      config_id: uuidv4(),
      regla_id: reglaId,
      tipo_config: createConfiguracionDto.tipo_config,
      valor: createConfiguracionDto.valor,
      meta_data: createConfiguracionDto.meta_data || '',
    });

    return this.configuracionReglaRepository.save(config);
  }

  async updateConfiguracion(
    configId: string,
    updateConfiguracionDto: CreateConfiguracionReglaDto,
  ): Promise<ConfiguracionRegla> {
    const config = await this.configuracionReglaRepository.findOne({
      where: { config_id: configId },
    });

    if (!config) {
      throw new NotFoundException(`Configuración con ID ${configId} no encontrada`);
    }

    config.tipo_config = updateConfiguracionDto.tipo_config;
    config.valor = updateConfiguracionDto.valor;
    if (updateConfiguracionDto.meta_data !== undefined) {
      config.meta_data = updateConfiguracionDto.meta_data;
    }

    return this.configuracionReglaRepository.save(config);
  }

  async activar(reglaId: string): Promise<ReglaPuntos> {
    const regla = await this.findOne(reglaId);
    const estadoAnterior = regla.activa;
    regla.activa = true;
    const reglaActualizada = await this.reglaPuntosRepository.save(regla);

    await this.crearAuditoria({
      usuario_admin: 'SYSTEM',
      accion: 'ACTIVACION_REGLA',
      detalles: JSON.stringify({
        regla_id: reglaId,
        nombre: regla.nombre,
        estado_anterior: estadoAnterior,
        estado_nuevo: true,
      }),
    });

    return reglaActualizada;
  }

  async desactivar(reglaId: string): Promise<ReglaPuntos> {
    const regla = await this.findOne(reglaId);
    const estadoAnterior = regla.activa;
    regla.activa = false;
    const reglaActualizada = await this.reglaPuntosRepository.save(regla);

    await this.crearAuditoria({
      usuario_admin: 'SYSTEM',
      accion: 'DESACTIVACION_REGLA',
      detalles: JSON.stringify({
        regla_id: reglaId,
        nombre: regla.nombre,
        estado_anterior: estadoAnterior,
        estado_nuevo: false,
      }),
    });

    return reglaActualizada;
  }

  private async crearAuditoria(data: {
    usuario_admin: string;
    accion: string;
    detalles: string;
  }): Promise<Auditoria> {
    const auditoria = this.auditoriaRepository.create({
      auditoria_id: uuidv4(),
      usuario_admin: data.usuario_admin,
      accion: data.accion,
      detalles: data.detalles,
    });

    return this.auditoriaRepository.save(auditoria);
  }

  async obtenerTasaPuntosActiva(): Promise<ReglaPuntos | null> {
    const now = new Date().toISOString();

    const regla = await this.reglaPuntosRepository
      .createQueryBuilder('regla')
      .leftJoinAndSelect('regla.configuraciones', 'config')
      .where('regla.activa = :activa', { activa: true })
      .andWhere('regla.fecha_vigencia_inicio <= :now', { now })
      .andWhere('(regla.fecha_vigencia_fin IS NULL OR regla.fecha_vigencia_fin >= :now)', { now })
      .andWhere('config.tipo_config = :tipoConfig', { tipoConfig: 'tasa' })
      .orderBy('regla.version', 'DESC')
      .addOrderBy('regla.fecha_vigencia_inicio', 'DESC')
      .getOne();

    return regla;
  }

  calcularPuntosPorLinea(
    precioUnitario: number,
    cantidad: number,
    regla: ReglaPuntos | null,
  ): number {
    if (!regla || !regla.configuraciones) {
      return 0;
    }

    const configTasa = regla.configuraciones.find((c) => c.tipo_config === 'tasa');

    if (!configTasa) {
      return 0;
    }

    const tasa = parseFloat(configTasa.valor);

    if (isNaN(tasa) || tasa <= 0) {
      return 0;
    }

    const montoLinea = precioUnitario * cantidad;
    const puntos = montoLinea * tasa;

    const configLimite = regla.configuraciones.find((c) => c.tipo_config === 'limite');

    if (configLimite) {
      const limite = parseFloat(configLimite.valor);
      if (!isNaN(limite) && limite > 0) {
        const limitePorLinea = limite;
        return Math.min(puntos, limitePorLinea);
      }
    }

    return Math.round(puntos * 100) / 100;
  }
}
