import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { NotificationResponseDto } from '../dtos/notification-response.dto';

/**
 * Caso de uso: Crear una nueva notificación
 */
@Injectable()
export class CreateNotificationUseCase {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(createNotificationDto: CreateNotificationDto): Promise<NotificationResponseDto> {
    // Crear la entidad del dominio
    const notificationId = uuidv4();
    const notification = Notification.create(
      notificationId,
      createNotificationDto.userId,
      createNotificationDto.type,
      createNotificationDto.subject,
      createNotificationDto.content,
    );

    // Persistir la notificación
    const savedNotification = await this.notificationRepository.save(notification);

    // Retornar DTO de respuesta
    return {
      id: savedNotification.id,
      userId: savedNotification.userId,
      type: savedNotification.typeValue,
      subject: savedNotification.subject,
      content: savedNotification.content,
      status: savedNotification.statusValue,
      sentAt: savedNotification.sentAt,
      createdAt: savedNotification.createdAt,
      updatedAt: savedNotification.updatedAt,
    };
  }
}
