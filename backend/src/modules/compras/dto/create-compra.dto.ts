import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLineaCompraDto } from './create-linea-compra.dto';

export class CreateCompraDto {
  @IsString()
  @IsNotEmpty()
  cliente_id: string;

  @IsString()
  @IsNotEmpty()
  canal_venta: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLineaCompraDto)
  lineas: CreateLineaCompraDto[];
}
