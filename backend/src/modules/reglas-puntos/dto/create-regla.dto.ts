import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsPositive, Min, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConfiguracionReglaDto {
  @IsString()
  @IsNotEmpty()
  tipo_config: 'tasa' | 'limite' | 'elegibilidad' | 'vencimiento';

  @IsString()
  @IsNotEmpty()
  valor: string;

  @IsString()
  @IsOptional()
  meta_data?: string;
}

export class CreateReglaPuntosDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsPositive()
  version: number;

  @IsString()
  @IsNotEmpty()
  fecha_vigencia_inicio: string;

  @IsString()
  @IsOptional()
  fecha_vigencia_fin?: string;

  @IsBoolean()
  @IsOptional()
  activa?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateConfiguracionReglaDto)
  @IsOptional()
  configuraciones?: CreateConfiguracionReglaDto[];
}
