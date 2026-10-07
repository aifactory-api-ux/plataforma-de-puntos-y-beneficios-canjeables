import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Compra } from './compra.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('devoluciones')
export class Devolucion {
  @ApiProperty({ description: 'Identificador único de la devolución' })
  @PrimaryColumn({ name: 'devolucion_id', type: 'varchar', length: 36 })
  devolucion_id: string;

  @ApiProperty({ description: 'Identificador de la compra asociada' })
  @Column({ name: 'compra_id', type: 'varchar', length: 36 })
  compra_id: string;

  @ApiProperty({ description: 'Fecha y hora de la devolución en ISO 8601' })
  @CreateDateColumn({ name: 'fecha_devolucion', type: 'timestamptz' })
  fecha_devolucion: string;

  @ApiProperty({ description: 'Monto de la devolución en COP' })
  @Column({
    name: 'monto_devolucion',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  monto_devolucion: number;

  @ManyToOne(() => Compra)
  @JoinColumn({ name: 'compra_id' })
  compra: Compra;
}
