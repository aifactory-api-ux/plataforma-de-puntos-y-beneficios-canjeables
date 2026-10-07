import { IsNumber, Min } from 'class-validator';

export class CreateDevolucionDto {
  @IsNumber()
  @Min(0)
  monto_devolucion: number;
}
