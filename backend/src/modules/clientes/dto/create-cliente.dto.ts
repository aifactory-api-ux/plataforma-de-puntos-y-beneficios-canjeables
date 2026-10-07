import { IsString, IsEmail, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({ description: 'Nombre completo del cliente', example: 'Juan Pérez' })
  @IsString()
  @MaxLength(255)
  nombre: string;

  @ApiProperty({ description: 'Correo electrónico del cliente', example: 'juan.perez@ejemplo.com' })
  @IsEmail()
  @MaxLength(255)
  email: string;
}

export class InscripcionRequestDto {
  @ApiProperty({ description: 'Indica si el cliente acepta los términos y condiciones', example: true })
  @IsBoolean()
  acepta_terminos: boolean;

  @ApiProperty({ description: 'Indica si el cliente da consentimiento para comunicaciones comerciales', example: false })
  @IsBoolean()
  consentimiento_comercial: boolean;

  @ApiProperty({ description: 'Versión de los términos aceptada por el cliente', example: '1.0.0' })
  @IsString()
  @MaxLength(20)
  terminos_version: string;
}
