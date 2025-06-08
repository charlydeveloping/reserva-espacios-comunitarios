import { Injectable, Inject } from '@nestjs/common';
import { NotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { NotificationResponseDto } from '../dtos/notification-response.dto';

/**
 * Caso de uso: Obtener notificaciones por usuario
 */
@Injectable()
export class GetNotificationsByUserUseCase {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(userId: string): Promise<NotificationResponseDto[]> {
    const notifications = await this.notificationRepository.findByUserId(userId);

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
