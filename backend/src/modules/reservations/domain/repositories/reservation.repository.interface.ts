import { BaseRepository } from '@shared/domain/base-repository.interface';
import { Reservation } from '../entities/reservation.entity';

/**
 * Puerto (interface) para el repositorio de reservas
 */
export interface ReservationRepository extends BaseRepository<Reservation, string> {
  findByUserId(userId: string): Promise<Reservation[]>;
  findBySpaceId(spaceId: string): Promise<Reservation[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]>;
  findConflictingReservations(
    spaceId: string,
    fecha: Date,
    horaInicio: Date,
    horaFin: Date,
    excludeReservationId?: string,
  ): Promise<Reservation[]>;
  findActiveReservations(): Promise<Reservation[]>;
  findByStatus(status: string): Promise<Reservation[]>;
}
