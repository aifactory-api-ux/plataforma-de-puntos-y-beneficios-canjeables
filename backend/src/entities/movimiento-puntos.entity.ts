import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CuentaPuntos } from './cuenta-puntos.entity';
import { ReglaPuntos } from './regla-puntos.entity';
import { Auditoria } from './auditoria.entity';
import { ApiProperty } from '@nestjs/swagger';

export type TipoMovimiento =
  | 'ACUMULACION'
  | 'CANJE'
  | 'VENCIMIENTO'
  | 'AJUSTE'
  | 'DEVOLUCION';

@Entity('movimientos_puntos')
export class MovimientoPuntos {
  @ApiProperty({ description: 'Identificador único del movimiento' })
  @PrimaryColumn({ name: 'movimiento_id', type: 'varchar', length: 36 })
  movimiento_id: string;

  @ApiProperty({ description: 'Identificador de la cuenta de puntos' })
  @Column({ name: 'cuenta_id', type: 'varchar', length: 36 })
  cuenta_id: string;

  @ApiProperty({
    description: 'Tipo de movimiento de puntos',
    enum: ['ACUMULACION', 'CANJE', 'VENCIMIENTO', 'AJUSTE', 'DEVOLUCION'],
  })
  @Column({ name: 'tipo_movimiento', type: 'varchar', length: 20 })
  tipo_movimiento: TipoMovimiento;

  @ApiProperty({ description: 'Cantidad de puntos del movimiento' })
  @Column({
    name: 'cantidad',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  cantidad: number;

  @ApiProperty({ description: 'Fecha y hora del movimiento en ISO 8601' })
  @CreateDateColumn({ name: 'fecha_movimiento', type: 'timestamptz' })
  fecha_movimiento: string;

  @ApiProperty({ description: 'Origen del movimiento (compra_id, canje_id, ajuste_id, etc.)' })
  @Column({ name: 'origen', type: 'varchar', length: 255, nullable: true })
  origen: string;

  @ApiProperty({ description: 'Identificador de la regla aplicada (si aplica)' })
  @Column({ name: 'regla_aplicada_id', type: 'varchar', length: 36, nullable: true })
  regla_aplicada_id: string;

  @ApiProperty({ description: 'Identificador del registro de auditoría' })
  @Column({ name: 'auditoria_id', type: 'varchar', length: 36, nullable: true })
  auditoria_id: string;

  @ManyToOne(() => CuentaPuntos)
  @JoinColumn({ name: 'cuenta_id' })
  cuenta: CuentaPuntos;

  @ManyToOne(() => ReglaPuntos, { nullable: true })
  @JoinColumn({ name: 'regla_aplicada_id' })
  regla_aplicada: ReglaPuntos;

  @ManyToOne(() => Auditoria, { nullable: true })
  @JoinColumn({ name: 'auditoria_id' })
  auditoria: Auditoria;
}
