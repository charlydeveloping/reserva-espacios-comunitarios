import { Injectable } from '@nestjs/common';
import { PrismaService } from '@config/prisma/prisma.service';
import { SpaceRepository } from '../../domain/repositories/space.repository.interface';
import { Space } from '../../domain/entities/space.entity';

/**
 * Implementación del repositorio de espacios usando Prisma
 */
@Injectable()
export class PrismaSpaceRepository implements SpaceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Space | null> {
    const spaceData = await this.prisma.space.findUnique({
      where: { id },
    });

    if (!spaceData) {
      return null;
    }

    return Space.fromPersistence(
      spaceData.id,
      spaceData.nombre,
      spaceData.tipo,
      spaceData.capacidad,
      spaceData.createdAt,
      spaceData.updatedAt,
    );
  }

  async findAll(): Promise<Space[]> {
    const spacesData = await this.prisma.space.findMany({
      orderBy: { nombre: 'asc' },
    });

    return spacesData.map(spaceData =>
      Space.fromPersistence(
        spaceData.id,
        spaceData.nombre,
        spaceData.tipo,
        spaceData.capacidad,
        spaceData.createdAt,
        spaceData.updatedAt,
      ),
    );
  }

  async save(space: Space): Promise<Space> {
    const spaceData = await this.prisma.space.create({
      data: {
        id: space.id,
        nombre: space.nombre,
        tipo: space.tipoValue,
        capacidad: space.capacidad,
        createdAt: space.createdAt,
        updatedAt: space.updatedAt,
      },
    });

    return Space.fromPersistence(
      spaceData.id,
      spaceData.nombre,
      spaceData.tipo,
      spaceData.capacidad,
      spaceData.createdAt,
      spaceData.updatedAt,
    );
  }

  async update(id: string, space: Partial<Space>): Promise<Space> {
    const spaceData = await this.prisma.space.update({
      where: { id },
      data: {
        nombre: space.nombre,
        tipo: space.tipoValue,
        capacidad: space.capacidad,
        updatedAt: new Date(),
      },
    });

    return Space.fromPersistence(
      spaceData.id,
      spaceData.nombre,
      spaceData.tipo,
      spaceData.capacidad,
      spaceData.createdAt,
      spaceData.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.space.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.space.count({
      where: { id },
    });
    return count > 0;
  }

  async findByType(type: string): Promise<Space[]> {
    const spacesData = await this.prisma.space.findMany({
      where: { tipo: type },
      orderBy: { nombre: 'asc' },
    });

    return spacesData.map(spaceData =>
      Space.fromPersistence(
        spaceData.id,
        spaceData.nombre,
        spaceData.tipo,
        spaceData.capacidad,
        spaceData.createdAt,
        spaceData.updatedAt,
      ),
    );
  }

  async findByCapacityRange(minCapacity: number, maxCapacity?: number): Promise<Space[]> {
    const where: any = {
      capacidad: {
        gte: minCapacity,
      },
    };

    if (maxCapacity) {
      where.capacidad.lte = maxCapacity;
    }

    const spacesData = await this.prisma.space.findMany({
      where,
      orderBy: { capacidad: 'asc' },
    });

    return spacesData.map(spaceData =>
      Space.fromPersistence(
        spaceData.id,
        spaceData.nombre,
        spaceData.tipo,
        spaceData.capacidad,
        spaceData.createdAt,
        spaceData.updatedAt,
      ),
    );
  }

  async findAvailableSpaces(date: Date, startTime: Date, endTime: Date): Promise<Space[]> {
    // Buscar espacios que NO tienen reservas confirmadas en el rango de tiempo especificado
    const spacesData = await this.prisma.space.findMany({
      where: {
        reservas: {
          none: {
            fecha: date,
            estado: {
              in: ['CONFIRMED', 'PENDING'],
            },
            OR: [
              {
                AND: [
                  { horaInicio: { lte: startTime } },
                  { horaFin: { gt: startTime } },
                ],
              },
              {
                AND: [
                  { horaInicio: { lt: endTime } },
                  { horaFin: { gte: endTime } },
                ],
              },
              {
                AND: [
                  { horaInicio: { gte: startTime } },
                  { horaFin: { lte: endTime } },
                ],
              },
            ],
          },
        },
      },
      orderBy: { nombre: 'asc' },
    });

    return spacesData.map(spaceData =>
      Space.fromPersistence(
        spaceData.id,
        spaceData.nombre,
        spaceData.tipo,
        spaceData.capacidad,
        spaceData.createdAt,
        spaceData.updatedAt,
      ),
    );
  }
}
