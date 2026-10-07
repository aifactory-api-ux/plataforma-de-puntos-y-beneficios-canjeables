import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('cuentas_puntos')
export class CuentaPuntos {
  @ApiProperty({ description: 'Identificador único de la cuenta de puntos' })
  @PrimaryColumn({ name: 'cuenta_id', type: 'varchar', length: 36 })
  cuenta_id: string;

  @ApiProperty({ description: 'Identificador del cliente propietario' })
  @Column({ name: 'cliente_id', type: 'varchar', length: 36 })
  cliente_id: string;

  @ApiProperty({ description: 'Saldo actual disponible de puntos' })
  @Column({
    name: 'saldo_actual',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  saldo_actual: number;

  @ApiProperty({ description: 'Saldo pendiente de puntos (por confirmar)' })
  @Column({
    name: 'saldo_pendiente',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  saldo_pendiente: number;

  @ApiProperty({ description: 'Fecha de creación de la cuenta en ISO 8601' })
  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamptz' })
  fecha_creacion: string;

  @ApiProperty({
    description: 'Fecha de última actualización en ISO 8601',
  })
  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamptz' })
  fecha_actualizacion: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.cuentas_puntos)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;
}
