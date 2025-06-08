import { Injectable } from '@nestjs/common';
import { PrismaService } from '@config/prisma/prisma.service';
import { NotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationType, NotificationStatus } from '@prisma/client';

/**
 * Implementación del repositorio de notificaciones usando Prisma
 */
@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Notification | null> {
    const notificationData = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notificationData) {
      return null;
    }

    return Notification.fromPersistence(
      notificationData.id,
      notificationData.userId,
      notificationData.type,
      notificationData.subject,
      notificationData.content,
      notificationData.status,
      notificationData.sentAt,
      notificationData.createdAt,
      notificationData.updatedAt,
    );
  }

  async findAll(): Promise<Notification[]> {
    const notificationsData = await this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return notificationsData.map(notificationData =>
      Notification.fromPersistence(
        notificationData.id,
        notificationData.userId,
        notificationData.type,
        notificationData.subject,
        notificationData.content,
        notificationData.status,
        notificationData.sentAt,
        notificationData.createdAt,
        notificationData.updatedAt,
      ),
    );
  }

  async save(notification: Notification): Promise<Notification> {
    const notificationData = await this.prisma.notification.create({
      data: {
        id: notification.id,
        userId: notification.userId,
        type: notification.typeValue as NotificationType,
        subject: notification.subject,
        content: notification.content,
        status: notification.statusValue as NotificationStatus,
        sentAt: notification.sentAt,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      },
    });

    return Notification.fromPersistence(
      notificationData.id,
      notificationData.userId,
      notificationData.type,
      notificationData.subject,
      notificationData.content,
      notificationData.status,
      notificationData.sentAt,
      notificationData.createdAt,
      notificationData.updatedAt,
    );
  }

  async update(id: string, notification: Partial<Notification>): Promise<Notification> {
    const notificationData = await this.prisma.notification.update({
      where: { id },
      data: {
        status: notification.statusValue as NotificationStatus,
        sentAt: notification.sentAt,
        updatedAt: new Date(),
      },
    });

    return Notification.fromPersistence(
      notificationData.id,
      notificationData.userId,
      notificationData.type,
      notificationData.subject,
      notificationData.content,
      notificationData.status,
      notificationData.sentAt,
      notificationData.createdAt,
      notificationData.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.notification.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.notification.count({
      where: { id },
    });
    return count > 0;
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const notificationsData = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return notificationsData.map(notificationData =>
      Notification.fromPersistence(
        notificationData.id,
        notificationData.userId,
        notificationData.type,
        notificationData.subject,
        notificationData.content,
        notificationData.status,
        notificationData.sentAt,
        notificationData.createdAt,
        notificationData.updatedAt,
      ),
    );
  }

  async findByType(type: string): Promise<Notification[]> {
    const notificationsData = await this.prisma.notification.findMany({
      where: { type: type as NotificationType },
      orderBy: { createdAt: 'desc' },
    });

    return notificationsData.map(notificationData =>
      Notification.fromPersistence(
        notificationData.id,
        notificationData.userId,
        notificationData.type,
        notificationData.subject,
        notificationData.content,
        notificationData.status,
        notificationData.sentAt,
        notificationData.createdAt,
        notificationData.updatedAt,
      ),
    );
  }

  async findByStatus(status: string): Promise<Notification[]> {
    const notificationsData = await this.prisma.notification.findMany({
      where: { status: status as NotificationStatus },
      orderBy: { createdAt: 'desc' },
    });

    return notificationsData.map(notificationData =>
      Notification.fromPersistence(
        notificationData.id,
        notificationData.userId,
        notificationData.type,
        notificationData.subject,
        notificationData.content,
        notificationData.status,
        notificationData.sentAt,
        notificationData.createdAt,
        notificationData.updatedAt,
      ),
    );
  }

  async findPendingNotifications(): Promise<Notification[]> {
    return this.findByStatus('PENDING');
  }

  async findByUserIdAndType(userId: string, type: string): Promise<Notification[]> {
    const notificationsData = await this.prisma.notification.findMany({
      where: { userId, type: type as NotificationType },
      orderBy: { createdAt: 'desc' },
    });

    return notificationsData.map(notificationData =>
      Notification.fromPersistence(
        notificationData.id,
        notificationData.userId,
        notificationData.type,
        notificationData.subject,
        notificationData.content,
        notificationData.status,
        notificationData.sentAt,
        notificationData.createdAt,
        notificationData.updatedAt,
      ),
    );
  }
}
