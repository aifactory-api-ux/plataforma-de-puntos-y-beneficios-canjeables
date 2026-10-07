import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ConfiguracionRegla } from './configuracion-regla.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('reglas_puntos')
export class ReglaPuntos {
  @ApiProperty({ description: 'Identificador único de la regla de puntos' })
  @PrimaryColumn({ name: 'regla_id', type: 'varchar', length: 36 })
  regla_id: string;

  @ApiProperty({ description: 'Nombre descriptivo de la regla' })
  @Column({ name: 'nombre', type: 'varchar', length: 255 })
  nombre: string;

  @ApiProperty({ description: 'Descripción detallada de la regla' })
  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion: string;

  @ApiProperty({ description: 'Versión de la regla para control de cambios' })
  @Column({ name: 'version', type: 'int', default: 1 })
  version: number;

  @ApiProperty({ description: 'Fecha de inicio de vigencia en ISO 8601' })
  @Column({ name: 'fecha_vigencia_inicio', type: 'timestamptz' })
  fecha_vigencia_inicio: string;

  @ApiProperty({ description: 'Fecha de fin de vigencia en ISO 8601 (nula si no expira)' })
  @Column({ name: 'fecha_vigencia_fin', type: 'timestamptz', nullable: true })
  fecha_vigencia_fin: string;

  @ApiProperty({ description: 'Indica si la regla está activa' })
  @Column({ name: 'activa', type: 'boolean', default: true })
  activa: boolean;

  @OneToMany(() => ConfiguracionRegla, (config) => config.regla)
  configuraciones: ConfiguracionRegla[];
}
