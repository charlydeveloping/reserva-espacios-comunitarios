import { IsNotEmpty, IsString, MaxLength, IsInt, Min, Max, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateSpaceDto {
  @ApiProperty({
    description: 'Nombre del espacio',
    example: 'Sala de Reuniones Principal',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'Tipo de espacio',
    example: 'sala_reunion',
    enum: ['sala_reunion', 'cancha_deportiva', 'auditorio', 'salon_eventos', 'laboratorio', 'biblioteca', 'patio', 'gimnasio'],
  })
  @IsNotEmpty({ message: 'El tipo es requerido' })
  @IsString({ message: 'El tipo debe ser un texto' })
  @IsIn(['sala_reunion', 'cancha_deportiva', 'auditorio', 'salon_eventos', 'laboratorio', 'biblioteca', 'patio', 'gimnasio'], {
    message: 'Tipo de espacio inválido',
  })
  tipo: string;

  @ApiProperty({
    description: 'Capacidad máxima del espacio',
    example: 20,
    minimum: 1,
    maximum: 1000,
  })
  @IsNotEmpty({ message: 'La capacidad es requerida' })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'La capacidad debe ser un número entero' })
  @Min(1, { message: 'La capacidad debe ser mayor a 0' })
  @Max(1000, { message: 'La capacidad no puede exceder 1000 personas' })
  capacidad: number;
}
