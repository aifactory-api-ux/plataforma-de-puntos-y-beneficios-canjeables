import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { CuentaPuntos } from './cuenta-puntos.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('clientes')
export class Cliente {
  @ApiProperty({ description: 'Identificador único del cliente' })
  @PrimaryColumn({ name: 'cliente_id', type: 'varchar', length: 36 })
  cliente_id: string;

  @ApiProperty({ description: 'Nombre completo del cliente' })
  @Column({ name: 'nombre', type: 'varchar', length: 255 })
  nombre: string;

  @ApiProperty({ description: 'Correo electrónico del cliente' })
  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ description: 'Fecha de registro del cliente en ISO 8601' })
  @CreateDateColumn({ name: 'fecha_registro', type: 'timestamptz' })
  fecha_registro: string;

  @OneToMany(() => CuentaPuntos, (cuenta) => cuenta.cliente)
  cuentas_puntos: CuentaPuntos[];
}
