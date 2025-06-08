import { Injectable, Inject } from '@nestjs/common';
import { SpaceRepository } from '../../domain/repositories/space.repository.interface';
import { SpaceResponseDto } from '../dtos/space-response.dto';
import { EntityNotFoundException } from '@shared/domain/exceptions';

/**
 * Caso de uso: Obtener un espacio por ID
 */
@Injectable()
export class GetSpaceByIdUseCase {
  constructor(
    @Inject('SpaceRepository')
    private readonly spaceRepository: SpaceRepository,
  ) {}

  async execute(id: string): Promise<SpaceResponseDto> {
    const space = await this.spaceRepository.findById(id);
    
    if (!space) {
      throw new EntityNotFoundException('Espacio', id);
    }

    return {
      id: space.id,
      nombre: space.nombre,
      tipo: space.tipoValue,
      capacidad: space.capacidad,
      createdAt: space.createdAt,
      updatedAt: space.updatedAt,
    };
  }
}
