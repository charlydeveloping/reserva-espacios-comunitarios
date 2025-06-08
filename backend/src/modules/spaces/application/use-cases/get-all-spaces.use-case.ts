import { Injectable, Inject } from '@nestjs/common';
import { SpaceRepository } from '../../domain/repositories/space.repository.interface';
import { SpaceResponseDto } from '../dtos/space-response.dto';

/**
 * Caso de uso: Obtener todos los espacios
 */
@Injectable()
export class GetAllSpacesUseCase {
  constructor(
    @Inject('SpaceRepository')
    private readonly spaceRepository: SpaceRepository,
  ) {}

  async execute(): Promise<SpaceResponseDto[]> {
    const spaces = await this.spaceRepository.findAll();

    return spaces.map(space => ({
      id: space.id,
      nombre: space.nombre,
      tipo: space.tipoValue,
      capacidad: space.capacidad,
      createdAt: space.createdAt,
      updatedAt: space.updatedAt,
    }));
  }
}
