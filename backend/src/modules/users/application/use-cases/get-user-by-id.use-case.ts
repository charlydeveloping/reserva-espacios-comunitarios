import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UserResponseDto } from '../dtos/user-response.dto';
import { EntityNotFoundException } from '@shared/domain/exceptions';

/**
 * Caso de uso: Obtener un usuario por ID
 */
@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new EntityNotFoundException('Usuario', id);
    }

    return {
      id: user.id,
      nombre: user.nombre,
      email: user.emailValue,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
