import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty({
    description: 'ID único de la notificación',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID del usuario destinatario',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  userId: string;

  @ApiProperty({
    description: 'Tipo de notificación',
    example: 'RESERVATION_CONFIRMATION',
    enum: ['RESERVATION_CONFIRMATION', 'RESERVATION_CANCELLATION', 'RESERVATION_REMINDER', 'SYSTEM_ANNOUNCEMENT'],
  })
  type: string;

  @ApiProperty({
    description: 'Asunto de la notificación',
    example: 'Confirmación de reserva',
  })
  subject: string;

  @ApiProperty({
    description: 'Contenido de la notificación',
    example: 'Su reserva ha sido confirmada exitosamente.',
  })
  content: string;

  @ApiProperty({
    description: 'Estado de la notificación',
    example: 'SENT',
    enum: ['PENDING', 'SENT', 'FAILED'],
  })
  status: string;

  @ApiProperty({
    description: 'Fecha de envío',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  sentAt?: Date;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}
