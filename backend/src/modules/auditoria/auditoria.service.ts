import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Auditoria } from '../../entities/auditoria.entity';

export interface QueryAuditoria {
  usuario_admin?: string;
  accion?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(Auditoria)
    private readonly auditoriaRepository: Repository<Auditoria>,
  ) {}

  async findAll(query: QueryAuditoria): Promise<Auditoria[]> {
    const qb = this.auditoriaRepository.createQueryBuilder('auditoria');

    if (query.usuario_admin) {
      qb.andWhere('auditoria.usuario_admin ILIKE :usuario_admin', {
        usuario_admin: `%${query.usuario_admin}%`,
      });
    }

    if (query.accion) {
      qb.andWhere('auditoria.accion = :accion', { accion: query.accion });
    }

    if (query.fecha_desde) {
      qb.andWhere('auditoria.fecha_accion >= :fecha_desde', {
        fecha_desde: new Date(query.fecha_desde),
      });
    }

    if (query.fecha_hasta) {
      qb.andWhere('auditoria.fecha_accion <= :fecha_hasta', {
        fecha_hasta: new Date(query.fecha_hasta),
      });
    }

    return qb.orderBy('auditoria.fecha_accion', 'DESC').getMany();
  }

  async findOne(auditoriaId: string): Promise<Auditoria> {
    const auditoria = await this.auditoriaRepository.findOne({
      where: { auditoria_id: auditoriaId },
    });

    if (!auditoria) {
      throw new NotFoundException(`Registro de auditoria con ID ${auditoriaId} no encontrado`);
    }

    return auditoria;
  }

  async crearAuditoria(data: {
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
}
