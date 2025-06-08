import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UserResponseDto } from '../dtos/user-response.dto';

/**
 * Caso de uso: Obtener todos los usuarios
 */
@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();

    return users.map(user => ({
      id: user.id,
      nombre: user.nombre,
      email: user.emailValue,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
}
