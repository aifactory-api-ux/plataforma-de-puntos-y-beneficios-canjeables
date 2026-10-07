import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ReglaPuntos } from './regla-puntos.entity';
import { ApiProperty } from '@nestjs/swagger';

export type TipoConfig = 'tasa' | 'limite' | 'elegibilidad' | 'vencimiento';

@Entity('configuraciones_regla')
export class ConfiguracionRegla {
  @ApiProperty({ description: 'Identificador único de la configuración' })
  @PrimaryColumn({ name: 'config_id', type: 'varchar', length: 36 })
  config_id: string;

  @ApiProperty({ description: 'Identificador de la regla padre' })
  @Column({ name: 'regla_id', type: 'varchar', length: 36 })
  regla_id: string;

  @ApiProperty({
    description: 'Tipo de configuración: tasa, limite, elegibilidad, vencimiento',
    enum: ['tasa', 'limite', 'elegibilidad', 'vencimiento'],
  })
  @Column({ name: 'tipo_config', type: 'varchar', length: 20 })
  tipo_config: TipoConfig;

  @ApiProperty({ description: 'Valor de la configuración' })
  @Column({ name: 'valor', type: 'varchar', length: 255 })
  valor: string;

  @ApiProperty({ description: 'Metadatos adicionales en formato JSON' })
  @Column({ name: 'meta_data', type: 'text', nullable: true })
  meta_data: string;

  @ManyToOne(() => ReglaPuntos, (regla) => regla.configuraciones)
  @JoinColumn({ name: 'regla_id' })
  regla: ReglaPuntos;
}
