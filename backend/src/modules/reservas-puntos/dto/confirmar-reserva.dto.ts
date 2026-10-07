import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmarReservaDto {
  @ApiProperty({ description: 'Estado de la reserva', enum: ['CONFIRMADA', 'CANCELADA'], example: 'CONFIRMADA' })
  @IsString()
  estado: 'CONFIRMADA' | 'CANCELADA';
}
