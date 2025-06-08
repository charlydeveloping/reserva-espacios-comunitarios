import { ApiProperty } from '@nestjs/swagger';

export class SpaceBasicDto {
  @ApiProperty({
    description: 'ID único del espacio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del espacio',
    example: 'Salón de eventos principal',
  })
  nombre: string;

  @ApiProperty({
    description: 'Descripción del espacio',
    example: 'Salón amplio para eventos corporativos',
  })
  descripcion?: string;

  @ApiProperty({
    description: 'Capacidad máxima del espacio',
    example: 50,
  })
  capacidad: number;

  @ApiProperty({
    description: 'Ubicación del espacio',
    example: 'Edificio A, Planta 2',
  })
  ubicacion?: string;

  @ApiProperty({
    description: 'Servicios disponibles',
    example: ['Proyector', 'WiFi', 'Aire acondicionado'],
  })
  servicios?: string[];

  @ApiProperty({
    description: 'Estado de disponibilidad',
    example: true,
  })
  disponible: boolean;
}

export class UserBasicDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Pérez',
  })
  nombre: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@email.com',
  })
  email: string;
}

export class ReservationFullResponseDto {
  @ApiProperty({
    description: 'ID único de la reserva',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID del usuario que hizo la reserva',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  userId: string;

  @ApiProperty({
    description: 'ID del espacio reservado',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  spaceId: string;

  @ApiProperty({
    description: 'Fecha de la reserva',
    example: '2024-01-15',
  })
  date: string;

  @ApiProperty({
    description: 'Fecha y hora de inicio de la reserva',
    example: '2024-01-15T09:00:00Z',
  })
  startTime: string;

  @ApiProperty({
    description: 'Fecha y hora de fin de la reserva',
    example: '2024-01-15T11:00:00Z',
  })
  endTime: string;

  @ApiProperty({
    description: 'Estado de la reserva',
    example: 'PENDING',
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
  })
  status: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-10T10:30:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-10T10:30:00Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Información del espacio reservado',
    type: SpaceBasicDto,
  })
  space: SpaceBasicDto;

  @ApiProperty({
    description: 'Información del usuario que hizo la reserva',
    type: UserBasicDto,
  })
  user: UserBasicDto;
}
