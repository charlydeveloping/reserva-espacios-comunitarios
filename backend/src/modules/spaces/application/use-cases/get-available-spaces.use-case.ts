import { Injectable, Inject } from '@nestjs/common';
import { SpaceRepository } from '../../domain/repositories/space.repository.interface';
import { SpaceResponseDto } from '../dtos/space-response.dto';

/**
 * Caso de uso: Obtener espacios disponibles para una fecha y horario específicos
 * Implementa lógica de negocio para verificar disponibilidad
 */
@Injectable()
export class GetAvailableSpacesUseCase {
  constructor(
    @Inject('SpaceRepository')
    private readonly spaceRepository: SpaceRepository,
  ) {}

  async execute(
    date: Date,
    startTime: Date,
    endTime: Date,
    minCapacity?: number,
  ): Promise<SpaceResponseDto[]> {
    let availableSpaces = await this.spaceRepository.findAvailableSpaces(
      date,
      startTime,
      endTime,
    );

    // Filtrar por capacidad mínima si se especifica
    if (minCapacity && minCapacity > 0) {
      availableSpaces = availableSpaces.filter(space =>
        space.canAccommodate(minCapacity),
      );
    }

    return availableSpaces.map(space => ({
      id: space.id,
      nombre: space.nombre,
      tipo: space.tipoValue,
      capacidad: space.capacidad,
      createdAt: space.createdAt,
      updatedAt: space.updatedAt,
    }));
  }
}
