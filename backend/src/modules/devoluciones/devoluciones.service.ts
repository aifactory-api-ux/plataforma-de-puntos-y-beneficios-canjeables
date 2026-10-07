import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Devolucion } from '../../entities/devolucion.entity';
import { Compra } from '../../entities/compra.entity';

@Injectable()
export class DevolucionesService {
  constructor(
    @InjectRepository(Devolucion)
    private readonly devolucionRepository: Repository<Devolucion>,
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
  ) {}

  async findAll(): Promise<Devolucion[]> {
    return this.devolucionRepository.find({
      relations: ['compra'],
      order: { fecha_devolucion: 'DESC' },
    });
  }

  async findOne(devolucionId: string): Promise<Devolucion> {
    const devolucion = await this.devolucionRepository.findOne({
      where: { devolucion_id: devolucionId },
      relations: ['compra'],
    });

    if (!devolucion) {
      throw new NotFoundException(`Devolucion con ID ${devolucionId} no encontrada`);
    }

    return devolucion;
  }

  async findByCompra(compraId: string): Promise<Devolucion[]> {
    const compra = await this.compraRepository.findOne({
      where: { compra_id: compraId },
    });

    if (!compra) {
      throw new NotFoundException(`Compra con ID ${compraId} no encontrada`);
    }

    return this.devolucionRepository.find({
      where: { compra_id: compraId },
      relations: ['compra'],
      order: { fecha_devolucion: 'DESC' },
    });
  }
}
