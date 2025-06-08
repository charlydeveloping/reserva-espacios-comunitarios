import { Injectable, Inject } from '@nestjs/common';
import { ReservationRepository } from '../../domain/repositories/reservation.repository.interface';
import { ReservationResponseDto } from '../dtos/reservation-response.dto';

/**
 * Caso de uso: Obtener todas las reservas
 */
@Injectable()
export class GetAllReservationsUseCase {
  constructor(
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async execute(): Promise<ReservationResponseDto[]> {
    const reservations = await this.reservationRepository.findAll();

    return reservations.map(reservation => ({
      id: reservation.id,
      usuarioId: reservation.usuarioId,
      espacioId: reservation.espacioId,
      fecha: reservation.fecha,
      horaInicio: reservation.horaInicio,
      horaFin: reservation.horaFin,
      estado: reservation.estadoValue,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
    }));
  }
}
