import { Module } from '@nestjs/common';
import { NotificationsController } from './infrastructure/controllers/notifications.controller';
import { PrismaNotificationRepository } from './infrastructure/repositories/prisma-notification.repository';
import { MockEmailAdapter } from './infrastructure/adapters/mock-email.adapter';
import { CreateNotificationUseCase } from './application/use-cases/create-notification.use-case';
import { GetAllNotificationsUseCase } from './application/use-cases/get-all-notifications.use-case';
import { GetNotificationsByUserUseCase } from './application/use-cases/get-notifications-by-user.use-case';

@Module({
  controllers: [NotificationsController],
  providers: [
    // Repositorio
    {
      provide: 'NotificationRepository',
      useClass: PrismaNotificationRepository,
    },
    
    // Adaptadores
    {
      provide: 'NotificationPort',
      useClass: MockEmailAdapter,
    },
    
    // Casos de uso
    CreateNotificationUseCase,
    GetAllNotificationsUseCase,
    GetNotificationsByUserUseCase,
  ],
  exports: [
    'NotificationRepository',
    'NotificationPort',
    CreateNotificationUseCase,
    GetAllNotificationsUseCase,
    GetNotificationsByUserUseCase,
  ],
})
export class NotificationsModule {}
