import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Space } from '../../domain/entities/space.entity';
import { SpaceRepository } from '../../domain/repositories/space.repository.interface';
import { CreateSpaceDto } from '../dtos/create-space.dto';
import { SpaceResponseDto } from '../dtos/space-response.dto';

/**
 * Caso de uso: Crear un nuevo espacio
 */
@Injectable()
export class CreateSpaceUseCase {
  constructor(
    @Inject('SpaceRepository')
    private readonly spaceRepository: SpaceRepository,
  ) {}

  async execute(createSpaceDto: CreateSpaceDto): Promise<SpaceResponseDto> {
    // Crear la entidad del dominio
    const spaceId = uuidv4();
    const space = Space.create(
      spaceId,
      createSpaceDto.nombre,
      createSpaceDto.tipo,
      createSpaceDto.capacidad,
    );

    // Persistir el espacio
    const savedSpace = await this.spaceRepository.save(space);

    // Retornar DTO de respuesta
    return {
      id: savedSpace.id,
      nombre: savedSpace.nombre,
      tipo: savedSpace.tipoValue,
      capacidad: savedSpace.capacidad,
      createdAt: savedSpace.createdAt,
      updatedAt: savedSpace.updatedAt,
    };
  }
}
