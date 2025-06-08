import { Injectable, Inject } from '@nestjs/common';
import { ReservationRepository } from '../../domain/repositories/reservation.repository.interface';
import { ReservationFullResponseDto } from '../dtos/reservation-full-response.dto';
import { ReservationMappingService } from '../services/reservation-mapping.service';
import { EntityNotFoundException } from '@shared/domain/exceptions';

/**
 * Caso de uso: Obtener una reserva por ID
 */
@Injectable()
export class GetReservationByIdUseCase {
  constructor(
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepository,
    private readonly mappingService: ReservationMappingService,
  ) {}

  async execute(id: string): Promise<ReservationFullResponseDto> {
    const reservation = await this.reservationRepository.findById(id);
    
    if (!reservation) {
      throw new EntityNotFoundException('Reserva', id);
    }

    return this.mappingService.mapToFullResponse(reservation);
  }
}
