import { BaseRepository } from '@shared/domain/base-repository.interface';
import { Notification } from '../entities/notification.entity';

/**
 * Puerto (interface) para el repositorio de notificaciones
 */
export interface NotificationRepository extends BaseRepository<Notification, string> {
  findByUserId(userId: string): Promise<Notification[]>;
  findByType(type: string): Promise<Notification[]>;
  findByStatus(status: string): Promise<Notification[]>;
  findPendingNotifications(): Promise<Notification[]>;
  findByUserIdAndType(userId: string, type: string): Promise<Notification[]>;
}
