import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelarReservaDto {
  @ApiProperty({
    description: 'Motivo de la cancelación de la reserva',
    example: 'Pago fallido - liberación de reserva',
    required: false,
  })
  @IsOptional()
  @IsString()
  motivo?: string;
}
