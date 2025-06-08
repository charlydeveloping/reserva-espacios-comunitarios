import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nombre del usuario',
    example: 'Juan Carlos Pérez',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Email del usuario',
    example: 'juan.carlos@email.com',
    maxLength: 255,
  })
  @IsOptional()
  @IsEmail({}, { message: 'El formato del email es inválido' })
  @MaxLength(255, { message: 'El email no puede exceder 255 caracteres' })
  email?: string;
}
