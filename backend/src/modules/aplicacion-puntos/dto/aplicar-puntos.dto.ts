import { IsString, IsNumber, IsPositive, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AplicarPuntosRequestDto {
  @ApiProperty({ description: 'Identificador del cliente', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  cliente_id: string;

  @ApiProperty({ description: 'Identificador de la compra', example: 'b2c3d4e5-f6a7-8901-bcde-f23456789012' })
  @IsUUID()
  compra_id: string;

  @ApiProperty({ description: 'Cantidad de puntos a usar para el descuento', example: 200 })
  @IsNumber()
  @IsPositive()
  @Min(1)
  puntos_a_usar: number;
}

export class AplicarPuntosResponseDto {
  @ApiProperty({ description: 'Identificador de la reserva creada', example: 'c3d4e5f6-a7b8-9012-cdef-345678901234' })
  reserva_id: string;

  @ApiProperty({ description: 'Identificador de la cuenta de puntos', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  cuenta_id: string;

  @ApiProperty({ description: 'Cantidad de puntos reservados', example: 200 })
  cantidad_reservada: number;

  @ApiProperty({ description: 'Equivalente en COP del descuento aplicado', example: 20000 })
  descuento_cop: number;

  @ApiProperty({ description: 'Estado de la reserva', example: 'PENDIENTE' })
  estado: string;

  @ApiProperty({ description: 'Fecha y hora de la reserva en ISO 8601', example: '2026-10-06T12:00:00.000Z' })
  fecha_reserva: string;
}
