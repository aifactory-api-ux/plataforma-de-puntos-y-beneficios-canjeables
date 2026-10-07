import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Cliente } from '../../entities/cliente.entity';
import { CuentaPuntos } from '../../entities/cuenta-puntos.entity';
import { Compra } from '../../entities/compra.entity';
import { LineaCompra } from '../../entities/linea-compra.entity';
import { Auditoria } from '../../entities/auditoria.entity';
import { CreateClienteDto, InscripcionRequestDto } from './dto/create-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(CuentaPuntos)
    private readonly cuentaPuntosRepository: Repository<CuentaPuntos>,
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
    @InjectRepository(LineaCompra)
    private readonly lineaCompraRepository: Repository<LineaCompra>,
    @InjectRepository(Auditoria)
    private readonly auditoriaRepository: Repository<Auditoria>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const existingCliente = await this.clienteRepository.findOne({
      where: { email: createClienteDto.email },
    });

    if (existingCliente) {
      throw new ConflictException('Ya existe un cliente registrado con este correo electrónico');
    }

    const cliente = this.clienteRepository.create({
      cliente_id: uuidv4(),
      nombre: createClienteDto.nombre,
      email: createClienteDto.email,
    });

    const savedCliente = await this.clienteRepository.save(cliente);

    await this.crearAuditoria({
      usuario_admin: 'SYSTEM',
      accion: 'CREACION_CLIENTE',
      detalles: JSON.stringify({ cliente_id: savedCliente.cliente_id, email: savedCliente.email }),
    });

    return savedCliente;
  }

  async findOne(clienteId: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { cliente_id: clienteId },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${clienteId} no encontrado`);
    }

    return cliente;
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    return this.clienteRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find({
      order: { fecha_registro: 'DESC' },
    });
  }

  async getCuentaPuntos(clienteId: string): Promise<CuentaPuntos> {
    await this.findOne(clienteId);

    let cuenta = await this.cuentaPuntosRepository.findOne({
      where: { cliente_id: clienteId },
    });

    if (!cuenta) {
      cuenta = this.cuentaPuntosRepository.create({
        cuenta_id: uuidv4(),
        cliente_id: clienteId,
        saldo_actual: 0,
        saldo_pendiente: 0,
      });
      cuenta = await this.cuentaPuntosRepository.save(cuenta);
    }

    return cuenta;
  }

  async inscripcion(clienteId: string, inscripcionDto: InscripcionRequestDto): Promise<{ cliente_id: string; cuenta_id: string; estado: string }> {
    const cliente = await this.findOne(clienteId);

    let cuenta = await this.cuentaPuntosRepository.findOne({
      where: { cliente_id: clienteId },
    });

    if (!cuenta) {
      cuenta = this.cuentaPuntosRepository.create({
        cuenta_id: uuidv4(),
        cliente_id: clienteId,
        saldo_actual: 0,
        saldo_pendiente: 0,
      });
      cuenta = await this.cuentaPuntosRepository.save(cuenta);
    }

    const detalles = {
      acepta_terminos: inscripcionDto.acepta_terminos,
      consentimiento_comercial: inscripcionDto.consentimiento_comercial,
      terminos_version: inscripcionDto.terminos_version,
      fecha_inscripcion: new Date().toISOString(),
    };

    await this.crearAuditoria({
      usuario_admin: cliente.email,
      accion: 'INSCRIPCION',
      detalles: JSON.stringify(detalles),
    });

    return {
      cliente_id: cliente.cliente_id,
      cuenta_id: cuenta.cuenta_id,
      estado: 'INSCRITO',
    };
  }

  async getCompras(clienteId: string): Promise<Compra[]> {
    await this.findOne(clienteId);

    const compras = await this.compraRepository.find({
      where: { cliente_id: clienteId },
      relations: ['lineas'],
      order: { fecha_compra: 'DESC' },
    });

    return compras;
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
}
