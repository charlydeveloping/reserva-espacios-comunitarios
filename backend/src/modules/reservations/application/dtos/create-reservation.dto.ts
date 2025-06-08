import { IsNotEmpty, IsString, IsDateString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({
    description: 'ID del usuario que hace la reserva',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsString({ message: 'El ID del usuario debe ser un texto' })
  usuarioId: string;

  @ApiProperty({
    description: 'ID del espacio a reservar',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty({ message: 'El ID del espacio es requerido' })
  @IsString({ message: 'El ID del espacio debe ser un texto' })
  espacioId: string;

  @ApiProperty({
    description: 'Fecha de la reserva (YYYY-MM-DD)',
    example: '2024-01-15',
  })
  @IsNotEmpty({ message: 'La fecha es requerida' })
  @IsDateString({}, { message: 'La fecha debe tener formato YYYY-MM-DD' })
  fecha: string;

  @ApiProperty({
    description: 'Hora de inicio (HH:MM)',
    example: '09:00',
  })
  @IsNotEmpty({ message: 'La hora de inicio es requerida' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora de inicio debe tener formato HH:MM',
  })
  horaInicio: string;

  @ApiProperty({
    description: 'Hora de fin (HH:MM)',
    example: '11:00',
  })
  @IsNotEmpty({ message: 'La hora de fin es requerida' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora de fin debe tener formato HH:MM',
  })
  horaFin: string;
}
