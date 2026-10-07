import { IsString, IsIn } from 'class-validator';

export class ConfirmarEntregaDto {
  @IsString()
  @IsIn(['ENTREGADA'])
  estado: 'ENTREGADA';
}
