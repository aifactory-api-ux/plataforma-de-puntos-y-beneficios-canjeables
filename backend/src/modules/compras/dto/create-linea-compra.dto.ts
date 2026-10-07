import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateLineaCompraDto {
  @IsString()
  @IsNotEmpty()
  producto_id: string;

  @IsNumber()
  @Min(1)
  cantidad: number;

  @IsNumber()
  @Min(0)
  precio_unitario: number;
}
