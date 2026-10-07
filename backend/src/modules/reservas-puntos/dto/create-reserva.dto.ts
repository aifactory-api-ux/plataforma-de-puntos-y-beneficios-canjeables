import { IsString, IsNumber, IsPositive, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservaDto {
  @ApiProperty({ description: 'Identificador de la cuenta de puntos', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  cuenta_id: string;

  @ApiProperty({ description: 'Cantidad de puntos a reservar', example: 100.50 })
  @IsNumber()
  @IsPositive()
  cantidad_reservada: number;
}
