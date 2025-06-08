import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationRepository } from '../../domain/repositories/reservation.repository.interface';
import { UserRepository } from '../../../users/domain/repositories/user.repository.interface';
import { SpaceRepository } from '../../../spaces/domain/repositories/space.repository.interface';
import { NotificationPort, ReservationNotificationData } from '../ports/notification.port';
import { CreateReservationDto } from '../dtos/create-reservation.dto';
import { ReservationResponseDto } from '../dtos/reservation-response.dto';
import { EntityNotFoundException, BusinessRuleViolationException } from '@shared/domain/exceptions';

/**
 * Caso de uso crítico: Crear una nueva reserva
 * 
 * Implementa las reglas de negocio más importantes del sistema:
 * - Verificar que el usuario existe
 * - Verificar que el espacio existe
 * - Verificar que no hay conflictos de horario
 * - Crear la reserva con estado PENDING
 * - Enviar notificación de confirmación (mock)
 * 
 * Este caso de uso demuestra la coordinación entre múltiples agregados
 * y servicios externos a través de puertos.
 */
@Injectable()
export class CreateReservationUseCase {
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

  async execute(createReservationDto: CreateReservationDto): Promise<ReservationResponseDto> {
    // 1. Verificar que el usuario existe
    const user = await this.userRepository.findById(createReservationDto.usuarioId);
    if (!user) {
      throw new EntityNotFoundException('Usuario', createReservationDto.usuarioId);
    }

    // 2. Verificar que el espacio existe
    const space = await this.spaceRepository.findById(createReservationDto.espacioId);
    if (!space) {
      throw new EntityNotFoundException('Espacio', createReservationDto.espacioId);
    }

    // 3. Construir fechas completas
    const fecha = new Date(createReservationDto.fecha);
    const horaInicio = new Date(`${createReservationDto.fecha}T${createReservationDto.horaInicio}:00`);
    const horaFin = new Date(`${createReservationDto.fecha}T${createReservationDto.horaFin}:00`);

    // 4. Verificar conflictos de horario
    const conflictingReservations = await this.reservationRepository.findConflictingReservations(
      createReservationDto.espacioId,
      fecha,
      horaInicio,
      horaFin,
    );

    if (conflictingReservations.length > 0) {
      throw new BusinessRuleViolationException(
        'Ya existe una reserva confirmada o pendiente en este horario para el espacio seleccionado',
      );
    }

    // 5. Crear la entidad del dominio (aplicará todas las reglas de negocio)
    const reservationId = uuidv4();
    const reservation = Reservation.create(
      reservationId,
      createReservationDto.usuarioId,
      createReservationDto.espacioId,
      fecha,
      horaInicio,
      horaFin,
    );

    // 6. Persistir la reserva
    const savedReservation = await this.reservationRepository.save(reservation);

    // 7. Enviar notificación de confirmación (adaptador mock)
    try {
      const notificationData: ReservationNotificationData = {
        reservationId: savedReservation.id,
        userName: user.nombre,
        spaceName: space.nombre,
        date: createReservationDto.fecha,
        startTime: createReservationDto.horaInicio,
        endTime: createReservationDto.horaFin,
      };

      await this.notificationService.sendReservationConfirmation(
        user.emailValue,
        notificationData,
      );
    } catch (error) {
      // Log del error pero no fallar la reserva
      console.warn('Error al enviar notificación:', error.message);
    }

    // 8. Retornar DTO de respuesta
    return {
      id: savedReservation.id,
      usuarioId: savedReservation.usuarioId,
      espacioId: savedReservation.espacioId,
      fecha: savedReservation.fecha,
      horaInicio: savedReservation.horaInicio,
      horaFin: savedReservation.horaFin,
      estado: savedReservation.estadoValue,
      createdAt: savedReservation.createdAt,
      updatedAt: savedReservation.updatedAt,
    };
  }
}
