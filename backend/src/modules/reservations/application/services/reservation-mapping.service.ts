import { Injectable, Inject } from '@nestjs/common';
import { Reservation } from '../../domain/entities/reservation.entity';
import { UserRepository } from '../../../users/domain/repositories/user.repository.interface';
import { SpaceRepository } from '../../../spaces/domain/repositories/space.repository.interface';
import { ReservationFullResponseDto, SpaceBasicDto, UserBasicDto } from '../dtos/reservation-full-response.dto';

@Injectable()
export class ReservationMappingService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('SpaceRepository')
    private readonly spaceRepository: SpaceRepository,
  ) {}

  async mapToFullResponse(reservation: Reservation): Promise<ReservationFullResponseDto> {
    // Fetch related entities
    const [user, space] = await Promise.all([
      this.userRepository.findById(reservation.usuarioId),
      this.spaceRepository.findById(reservation.espacioId),
    ]);

    // Map user to basic DTO
    const userDto: UserBasicDto = user ? {
      id: user.id,
      nombre: user.nombre,
      email: user.emailValue,
    } : {
      id: reservation.usuarioId,
      nombre: 'Usuario no encontrado',
      email: 'N/A',
    };

    // Map space to basic DTO
    const spaceDto: SpaceBasicDto = space ? {
      id: space.id,
      nombre: space.nombre,
      descripcion: undefined, // No disponible en la entidad
      capacidad: space.capacidad,
      ubicacion: undefined, // No disponible en la entidad
      servicios: [], // No disponible en la entidad
      disponible: space.isAvailable(),
    } : {
      id: reservation.espacioId,
      nombre: 'Espacio no encontrado',
      descripcion: undefined,
      capacidad: 0,
      ubicacion: undefined,
      servicios: undefined,
      disponible: false,
    };

    // Map reservation to full response DTO
    return {
      id: reservation.id,
      userId: reservation.usuarioId,
      spaceId: reservation.espacioId,
      date: reservation.fecha.toISOString().split('T')[0], // YYYY-MM-DD format
      startTime: reservation.horaInicio.toISOString(),
      endTime: reservation.horaFin.toISOString(),
      status: reservation.estadoValue,
      createdAt: reservation.createdAt.toISOString(),
      updatedAt: reservation.updatedAt.toISOString(),
      space: spaceDto,
      user: userDto,
    };
  }

  async mapToFullResponseList(reservations: Reservation[]): Promise<ReservationFullResponseDto[]> {
    return Promise.all(
      reservations.map(reservation => this.mapToFullResponse(reservation))
    );
  }
}
