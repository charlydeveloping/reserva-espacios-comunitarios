import { Module } from '@nestjs/common';
import { ReservationsController } from './infrastructure/controllers/reservations.controller';
import { PrismaReservationRepository } from './infrastructure/repositories/prisma-reservation.repository';
import { CreateReservationUseCase } from './application/use-cases/create-reservation.use-case';
import { CancelReservationUseCase } from './application/use-cases/cancel-reservation.use-case';
import { GetAllReservationsUseCase } from './application/use-cases/get-all-reservations.use-case';
import { UsersModule } from '../users/users.module';
import { SpacesModule } from '../spaces/spaces.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    UsersModule,
    SpacesModule,
    NotificationsModule,
  ],
  controllers: [ReservationsController],
  providers: [
    // Repositorio
    {
      provide: 'ReservationRepository',
      useClass: PrismaReservationRepository,
    },
    
    // Casos de uso
    CreateReservationUseCase,
    CancelReservationUseCase,
    GetAllReservationsUseCase,
  ],
  exports: [
    'ReservationRepository',
    CreateReservationUseCase,
    CancelReservationUseCase,
    GetAllReservationsUseCase,
  ],
})
export class ReservationsModule {}
