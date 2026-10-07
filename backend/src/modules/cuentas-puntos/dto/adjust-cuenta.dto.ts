import { IsString, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdjustCuentaDto {
  @ApiProperty({ description: 'Cantidad de puntos a ajustar (positiva para aumentar, negativa para reducir)', example: 50 })
  @IsNumber()
  cantidad: number;

  @ApiProperty({ description: 'Usuario administrador que realiza el ajuste', example: 'admin@camper.com' })
  @IsString()
  @MaxLength(255)
  usuario_admin: string;

  @ApiProperty({ description: 'Detalles o motivo del ajuste', example: 'Corrección por error de sistema en la última acumulación' })
  @IsString()
  @MaxLength(500)
  detalles: string;
}
