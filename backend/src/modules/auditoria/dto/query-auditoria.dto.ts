import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryAuditoriaDto {
  @ApiPropertyOptional({ description: 'Filtrar por usuario administrador' })
  @IsOptional()
  @IsString()
  usuario_admin?: string;

  @ApiPropertyOptional({ description: 'Filtrar por accion' })
  @IsOptional()
  @IsString()
  accion?: string;

  @ApiPropertyOptional({ description: 'Filtrar desde fecha (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  fecha_desde?: string;

  @ApiPropertyOptional({ description: 'Filtrar hasta fecha (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  fecha_hasta?: string;
}
