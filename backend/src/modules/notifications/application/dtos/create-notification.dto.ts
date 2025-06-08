import { IsNotEmpty, IsString, IsIn, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'ID del usuario destinatario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsString({ message: 'El ID del usuario debe ser un texto' })
  userId: string;

  @ApiProperty({
    description: 'Tipo de notificación',
    example: 'RESERVATION_CONFIRMATION',
    enum: ['RESERVATION_CONFIRMATION', 'RESERVATION_CANCELLATION', 'RESERVATION_REMINDER', 'SYSTEM_ANNOUNCEMENT'],
  })
  @IsNotEmpty({ message: 'El tipo es requerido' })
  @IsString({ message: 'El tipo debe ser un texto' })
  @IsIn(['RESERVATION_CONFIRMATION', 'RESERVATION_CANCELLATION', 'RESERVATION_REMINDER', 'SYSTEM_ANNOUNCEMENT'], {
    message: 'Tipo de notificación inválido',
  })
  type: string;

  @ApiProperty({
    description: 'Asunto de la notificación',
    example: 'Confirmación de reserva',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'El asunto es requerido' })
  @IsString({ message: 'El asunto debe ser un texto' })
  @MaxLength(255, { message: 'El asunto no puede exceder 255 caracteres' })
  subject: string;

  @ApiProperty({
    description: 'Contenido de la notificación',
    example: 'Su reserva ha sido confirmada exitosamente.',
    maxLength: 2000,
  })
  @IsNotEmpty({ message: 'El contenido es requerido' })
  @IsString({ message: 'El contenido debe ser un texto' })
  @MaxLength(2000, { message: 'El contenido no puede exceder 2000 caracteres' })
  content: string;
}
