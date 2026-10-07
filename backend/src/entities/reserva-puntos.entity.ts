import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CuentaPuntos } from './cuenta-puntos.entity';
import { ApiProperty } from '@nestjs/swagger';

export type EstadoReserva = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';

@Entity('reservas_puntos')
export class ReservaPuntos {
  @ApiProperty({ description: 'Identificador único de la reserva' })
  @PrimaryColumn({ name: 'reserva_id', type: 'varchar', length: 36 })
  reserva_id: string;

  @ApiProperty({ description: 'Identificador de la cuenta de puntos' })
  @Column({ name: 'cuenta_id', type: 'varchar', length: 36 })
  cuenta_id: string;

  @ApiProperty({ description: 'Cantidad de puntos reservados' })
  @Column({
    name: 'cantidad_reservada',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  cantidad_reservada: number;

  @ApiProperty({ description: 'Fecha y hora de la reserva en ISO 8601' })
  @CreateDateColumn({ name: 'fecha_reserva', type: 'timestamptz' })
  fecha_reserva: string;

  @ApiProperty({
    description: 'Estado de la reserva',
    enum: ['PENDIENTE', 'CONFIRMADA', 'CANCELADA'],
  })
  @Column({ name: 'estado', type: 'varchar', length: 20 })
  estado: EstadoReserva;

  @ManyToOne(() => CuentaPuntos)
  @JoinColumn({ name: 'cuenta_id' })
  cuenta: CuentaPuntos;
}
