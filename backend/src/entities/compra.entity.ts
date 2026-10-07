import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { LineaCompra } from './linea-compra.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('compras')
export class Compra {
  @ApiProperty({ description: 'Identificador único de la compra' })
  @PrimaryColumn({ name: 'compra_id', type: 'varchar', length: 36 })
  compra_id: string;

  @ApiProperty({ description: 'Identificador del cliente que realizó la compra' })
  @Column({ name: 'cliente_id', type: 'varchar', length: 36 })
  cliente_id: string;

  @ApiProperty({ description: 'Canal de venta donde se realizó la compra' })
  @Column({ name: 'canal_venta', type: 'varchar', length: 50 })
  canal_venta: string;

  @ApiProperty({ description: 'Estado actual de la compra' })
  @Column({ name: 'estado', type: 'varchar', length: 30 })
  estado: string;

  @ApiProperty({ description: 'Monto total de la compra en COP' })
  @Column({
    name: 'monto_total',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  monto_total: number;

  @ApiProperty({ description: 'Fecha y hora de la compra en ISO 8601' })
  @CreateDateColumn({ name: 'fecha_compra', type: 'timestamptz' })
  fecha_compra: string;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @OneToMany(() => LineaCompra, (linea) => linea.compra)
  lineas: LineaCompra[];
}
