import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

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
