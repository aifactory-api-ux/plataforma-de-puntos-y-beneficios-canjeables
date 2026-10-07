import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoMovimiento } from '../../../entities/movimiento-puntos.entity';

export class MovimientoQueryDto {
  @ApiPropertyOptional({ description: 'Filtrar por ID del cliente' })
  @IsOptional()
  @IsString()
  cliente_id?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID de la cuenta de puntos' })
  @IsOptional()
  @IsString()
  cuenta_id?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por tipo de movimiento',
    enum: ['ACUMULACION', 'CANJE', 'VENCIMIENTO', 'AJUSTE', 'DEVOLUCION'],
  })
  @IsOptional()
  @IsEnum(['ACUMULACION', 'CANJE', 'VENCIMIENTO', 'AJUSTE', 'DEVOLUCION'])
  tipo_movimiento?: TipoMovimiento;

  @ApiPropertyOptional({ description: 'Fecha inicial del rango (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  fecha_desde?: string;

  @ApiPropertyOptional({ description: 'Fecha final del rango (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  fecha_hasta?: string;

  @ApiPropertyOptional({ description: 'Filtrar por origen (compra_id, canje_id, etc.)' })
  @IsOptional()
  @IsString()
  origen?: string;
}
