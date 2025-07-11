import { Injectable, Inject } from '@nestjs/common';
import { ReservationRepository } from '../../domain/repositories/reservation.repository.interface';
import { ReservationFullResponseDto } from '../dtos/reservation-full-response.dto';
import { ReservationMappingService } from '../services/reservation-mapping.service';

/**
 * Caso de uso: Obtener todas las reservas
 */
@Injectable()
export class GetAllReservationsUseCase {
  constructor(
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepository,
    private readonly mappingService: ReservationMappingService,
  ) {}

  async execute(): Promise<ReservationFullResponseDto[]> {
    const reservations = await this.reservationRepository.findAll();
    return this.mappingService.mapToFullResponseList(reservations);
  }
}
