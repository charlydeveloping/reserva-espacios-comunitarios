import { ApiProperty } from '@nestjs/swagger';

export class ReservationResponseDto {
  @ApiProperty({
    description: 'ID único de la reserva',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID del usuario que hizo la reserva',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  usuarioId: string;

  @ApiProperty({
    description: 'ID del espacio reservado',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  espacioId: string;

  @ApiProperty({
    description: 'Fecha de la reserva',
    example: '2024-01-15T00:00:00Z',
  })
  fecha: Date;

  @ApiProperty({
    description: 'Hora de inicio de la reserva',
    example: '2024-01-15T09:00:00Z',
  })
  horaInicio: Date;

  @ApiProperty({
    description: 'Hora de fin de la reserva',
    example: '2024-01-15T11:00:00Z',
  })
  horaFin: Date;

  @ApiProperty({
    description: 'Estado de la reserva',
    example: 'PENDING',
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
  })
  estado: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-10T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-10T10:30:00Z',
  })
  updatedAt: Date;
}
