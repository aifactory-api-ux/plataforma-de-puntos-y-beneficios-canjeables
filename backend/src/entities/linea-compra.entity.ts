import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Compra } from './compra.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('lineas_compra')
export class LineaCompra {
  @ApiProperty({ description: 'Identificador único de la línea de compra' })
  @PrimaryColumn({ name: 'linea_id', type: 'varchar', length: 36 })
  linea_id: string;

  @ApiProperty({ description: 'Identificador de la compra padre' })
  @Column({ name: 'compra_id', type: 'varchar', length: 36 })
  compra_id: string;

  @ApiProperty({ description: 'Identificador del producto' })
  @Column({ name: 'producto_id', type: 'varchar', length: 36 })
  producto_id: string;

  @ApiProperty({ description: 'Cantidad de unidades adquiridas' })
  @Column({ name: 'cantidad', type: 'int' })
  cantidad: number;

  @ApiProperty({ description: 'Precio unitario del producto en COP' })
  @Column({
    name: 'precio_unitario',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  precio_unitario: number;

  @ApiProperty({ description: 'Puntos acumulados por esta línea de compra' })
  @Column({
    name: 'puntos_acumulados',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  puntos_acumulados: number;

  @ManyToOne(() => Compra, (compra) => compra.lineas)
  @JoinColumn({ name: 'compra_id' })
  compra: Compra;
}
