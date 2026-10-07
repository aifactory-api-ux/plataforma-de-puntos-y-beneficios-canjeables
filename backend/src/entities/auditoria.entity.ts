import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('auditorias')
export class Auditoria {
  @ApiProperty({ description: 'Identificador único del registro de auditoría' })
  @PrimaryColumn({ name: 'auditoria_id', type: 'varchar', length: 36 })
  auditoria_id: string;

  @ApiProperty({ description: 'Nombre del usuario administrador que realizó la acción' })
  @Column({ name: 'usuario_admin', type: 'varchar', length: 255 })
  usuario_admin: string;

  @ApiProperty({ description: 'Acción realizada por el administrador' })
  @Column({ name: 'accion', type: 'varchar', length: 100 })
  accion: string;

  @ApiProperty({ description: 'Fecha y hora de la acción en ISO 8601' })
  @CreateDateColumn({ name: 'fecha_accion', type: 'timestamptz' })
  fecha_accion: string;

  @ApiProperty({ description: 'Detalles adicionales de la acción en formato JSON' })
  @Column({ name: 'detalles', type: 'text', nullable: true })
  detalles: string;
}
