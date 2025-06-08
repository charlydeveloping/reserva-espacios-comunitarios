import { Injectable, Inject } from '@nestjs/common';
import { NotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { NotificationResponseDto } from '../dtos/notification-response.dto';

/**
 * Caso de uso: Obtener todas las notificaciones
 */
@Injectable()
export class GetAllNotificationsUseCase {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(): Promise<NotificationResponseDto[]> {
    const notifications = await this.notificationRepository.findAll();

    return notifications.map(notification => ({
      id: notification.id,
      userId: notification.userId,
      type: notification.typeValue,
      subject: notification.subject,
      content: notification.content,
      status: notification.statusValue,
      sentAt: notification.sentAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    }));
  }
}
