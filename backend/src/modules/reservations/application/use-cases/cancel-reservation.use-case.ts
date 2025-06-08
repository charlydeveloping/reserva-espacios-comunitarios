import { Injectable, Inject } from '@nestjs/common';
import { ReservationRepository } from '../../domain/repositories/reservation.repository.interface';
import { UserRepository } from '../../../users/domain/repositories/user.repository.interface';
import { SpaceRepository } from '../../../spaces/domain/repositories/space.repository.interface';
import { NotificationPort, ReservationNotificationData } from '../ports/notification.port';
import { ReservationResponseDto } from '../dtos/reservation-response.dto';
import { EntityNotFoundException, BusinessRuleViolationException } from '@shared/domain/exceptions';

/**
 * Caso de uso crítico: Cancelar una reserva
 * 
 * Implementa reglas de negocio importantes:
 * - Solo el usuario propietario puede cancelar
 * - Solo se pueden cancelar reservas pendientes o confirmadas
 * - Enviar notificación de cancelación
 */
@Injectable()
export class CancelReservationUseCase {
  constructor(
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('SpaceRepository')
    private readonly spaceRepository: SpaceRepository,
    @Inject('NotificationPort')
    private readonly notificationService: NotificationPort,
  ) {}

  async execute(reservationId: string, userId: string): Promise<ReservationResponseDto> {
    // 1. Verificar que la reserva existe
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new EntityNotFoundException('Reserva', reservationId);
    }

    // 2. Verificar que el usuario es el propietario de la reserva
    if (reservation.usuarioId !== userId) {
      throw new BusinessRuleViolationException(
        'Solo el usuario propietario puede cancelar la reserva',
      );
    }

    // 3. Cancelar la reserva (aplicará reglas de negocio del dominio)
    reservation.cancel();

    // 4. Persistir los cambios
    const updatedReservation = await this.reservationRepository.update(reservationId, reservation);

    // 5. Obtener datos para notificación
    const user = await this.userRepository.findById(reservation.usuarioId);
    const space = await this.spaceRepository.findById(reservation.espacioId);

    // 6. Enviar notificación de cancelación
    if (user && space) {
      try {
        const notificationData: ReservationNotificationData = {
          reservationId: updatedReservation.id,
          userName: user.nombre,
          spaceName: space.nombre,
          date: updatedReservation.fecha.toISOString().split('T')[0],
          startTime: updatedReservation.horaInicio.toTimeString().substring(0, 5),
          endTime: updatedReservation.horaFin.toTimeString().substring(0, 5),
        };

        await this.notificationService.sendReservationCancellation(
          user.emailValue,
          notificationData,
        );
      } catch (error) {
        console.warn('Error al enviar notificación de cancelación:', error.message);
      }
    }

    // 7. Retornar DTO de respuesta
    return {
      id: updatedReservation.id,
      usuarioId: updatedReservation.usuarioId,
      espacioId: updatedReservation.espacioId,
      fecha: updatedReservation.fecha,
      horaInicio: updatedReservation.horaInicio,
      horaFin: updatedReservation.horaFin,
      estado: updatedReservation.estadoValue,
      createdAt: updatedReservation.createdAt,
      updatedAt: updatedReservation.updatedAt,
    };
  }
}
