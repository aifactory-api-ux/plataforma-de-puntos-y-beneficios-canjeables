import { IsString, IsNotEmpty, IsNumber, IsPositive, IsBoolean, IsOptional } from 'class-validator';

export class UpdateReglaPuntosDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  version?: number;

  @IsString()
  @IsOptional()
  fecha_vigencia_inicio?: string;

  @IsString()
  @IsOptional()
  fecha_vigencia_fin?: string;

  @IsBoolean()
  @IsOptional()
  activa?: boolean;
}
