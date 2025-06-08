import { ApiProperty } from '@nestjs/swagger';

export class SpaceResponseDto {
  @ApiProperty({
    description: 'ID único del espacio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del espacio',
    example: 'Sala de Reuniones Principal',
  })
  nombre: string;

  @ApiProperty({
    description: 'Tipo de espacio',
    example: 'sala_reunion',
  })
  tipo: string;

  @ApiProperty({
    description: 'Capacidad máxima del espacio',
    example: 20,
  })
  capacidad: number;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-20T15:45:00Z',
  })
  updatedAt: Date;
}
