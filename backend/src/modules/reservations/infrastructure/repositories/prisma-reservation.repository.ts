import { Injectable } from '@nestjs/common';
import { PrismaService } from '@config/prisma/prisma.service';
import { ReservationRepository } from '../../domain/repositories/reservation.repository.interface';
import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationStatus } from '@prisma/client';

/**
 * Implementación del repositorio de reservas usando Prisma
 */
@Injectable()
export class PrismaReservationRepository implements ReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Reservation | null> {
    const reservationData = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservationData) {
      return null;
    }

    return Reservation.fromPersistence(
      reservationData.id,
      reservationData.usuarioId,
      reservationData.espacioId,
      reservationData.fecha,
      reservationData.horaInicio,
      reservationData.horaFin,
      reservationData.estado,
      reservationData.createdAt,
      reservationData.updatedAt,
    );
  }

  async findAll(): Promise<Reservation[]> {
    const reservationsData = await this.prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return reservationsData.map(reservationData =>
      Reservation.fromPersistence(
        reservationData.id,
        reservationData.usuarioId,
        reservationData.espacioId,
        reservationData.fecha,
        reservationData.horaInicio,
        reservationData.horaFin,
        reservationData.estado,
        reservationData.createdAt,
        reservationData.updatedAt,
      ),
    );
  }

  async save(reservation: Reservation): Promise<Reservation> {
    const reservationData = await this.prisma.reservation.create({
      data: {
        id: reservation.id,
        usuarioId: reservation.usuarioId,
        espacioId: reservation.espacioId,
        fecha: reservation.fecha,
        horaInicio: reservation.horaInicio,
        horaFin: reservation.horaFin,
        estado: reservation.estadoValue as ReservationStatus,
        createdAt: reservation.createdAt,
        updatedAt: reservation.updatedAt,
      },
    });

    return Reservation.fromPersistence(
      reservationData.id,
      reservationData.usuarioId,
      reservationData.espacioId,
      reservationData.fecha,
      reservationData.horaInicio,
      reservationData.horaFin,
      reservationData.estado,
      reservationData.createdAt,
      reservationData.updatedAt,
    );
  }

  async update(id: string, reservation: Partial<Reservation>): Promise<Reservation> {
    const reservationData = await this.prisma.reservation.update({
      where: { id },
      data: {
        estado: reservation.estadoValue as ReservationStatus,
        updatedAt: new Date(),
      },
    });

    return Reservation.fromPersistence(
      reservationData.id,
      reservationData.usuarioId,
      reservationData.espacioId,
      reservationData.fecha,
      reservationData.horaInicio,
      reservationData.horaFin,
      reservationData.estado,
      reservationData.createdAt,
      reservationData.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.reservation.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.reservation.count({
      where: { id },
    });
    return count > 0;
  }

  async findByUserId(userId: string): Promise<Reservation[]> {
    const reservationsData = await this.prisma.reservation.findMany({
      where: { usuarioId: userId },
      orderBy: { fecha: 'desc' },
    });

    return reservationsData.map(reservationData =>
      Reservation.fromPersistence(
        reservationData.id,
        reservationData.usuarioId,
        reservationData.espacioId,
        reservationData.fecha,
        reservationData.horaInicio,
        reservationData.horaFin,
        reservationData.estado,
        reservationData.createdAt,
        reservationData.updatedAt,
      ),
    );
  }

  async findBySpaceId(spaceId: string): Promise<Reservation[]> {
    const reservationsData = await this.prisma.reservation.findMany({
      where: { espacioId: spaceId },
      orderBy: { fecha: 'desc' },
    });

    return reservationsData.map(reservationData =>
      Reservation.fromPersistence(
        reservationData.id,
        reservationData.usuarioId,
        reservationData.espacioId,
        reservationData.fecha,
        reservationData.horaInicio,
        reservationData.horaFin,
        reservationData.estado,
        reservationData.createdAt,
        reservationData.updatedAt,
      ),
    );
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]> {
    const reservationsData = await this.prisma.reservation.findMany({
      where: {
        fecha: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { fecha: 'asc' },
    });

    return reservationsData.map(reservationData =>
      Reservation.fromPersistence(
        reservationData.id,
        reservationData.usuarioId,
        reservationData.espacioId,
        reservationData.fecha,
        reservationData.horaInicio,
        reservationData.horaFin,
        reservationData.estado,
        reservationData.createdAt,
        reservationData.updatedAt,
      ),
    );
  }

  async findConflictingReservations(
    spaceId: string,
    fecha: Date,
    horaInicio: Date,
    horaFin: Date,
    excludeReservationId?: string,
  ): Promise<Reservation[]> {
    const where: any = {
      espacioId: spaceId,
      fecha: fecha,
      estado: {
        in: ['PENDING', 'CONFIRMED'],
      },
      OR: [
        {
          AND: [
            { horaInicio: { lte: horaInicio } },
            { horaFin: { gt: horaInicio } },
          ],
        },
        {
          AND: [
            { horaInicio: { lt: horaFin } },
            { horaFin: { gte: horaFin } },
          ],
        },
        {
          AND: [
            { horaInicio: { gte: horaInicio } },
            { horaFin: { lte: horaFin } },
          ],
        },
      ],
    };

    if (excludeReservationId) {
      where.id = { not: excludeReservationId };
    }

    const reservationsData = await this.prisma.reservation.findMany({
      where,
    });

    return reservationsData.map(reservationData =>
      Reservation.fromPersistence(
        reservationData.id,
        reservationData.usuarioId,
        reservationData.espacioId,
        reservationData.fecha,
        reservationData.horaInicio,
        reservationData.horaFin,
        reservationData.estado,
        reservationData.createdAt,
        reservationData.updatedAt,
      ),
    );
  }

  async findActiveReservations(): Promise<Reservation[]> {
    const reservationsData = await this.prisma.reservation.findMany({
      where: {
        estado: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      orderBy: { fecha: 'asc' },
    });

    return reservationsData.map(reservationData =>
      Reservation.fromPersistence(
        reservationData.id,
        reservationData.usuarioId,
        reservationData.espacioId,
        reservationData.fecha,
        reservationData.horaInicio,
        reservationData.horaFin,
        reservationData.estado,
        reservationData.createdAt,
        reservationData.updatedAt,
      ),
    );
  }

  async findByStatus(status: string): Promise<Reservation[]> {
    const reservationsData = await this.prisma.reservation.findMany({
      where: { estado: status as ReservationStatus },
      orderBy: { fecha: 'asc' },
    });

    return reservationsData.map(reservationData =>
      Reservation.fromPersistence(
        reservationData.id,
        reservationData.usuarioId,
        reservationData.espacioId,
        reservationData.fecha,
        reservationData.horaInicio,
        reservationData.horaFin,
        reservationData.estado,
        reservationData.createdAt,
        reservationData.updatedAt,
      ),
    );
  }
}
