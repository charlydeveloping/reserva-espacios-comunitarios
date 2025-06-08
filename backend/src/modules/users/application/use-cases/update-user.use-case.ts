import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { EntityNotFoundException, InvalidDataException } from '@shared/domain/exceptions';

/**
 * Caso de uso: Actualizar un usuario existente
 */
@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new EntityNotFoundException('Usuario', id);
    }

    // Verificar email duplicado si se está actualizando
    if (updateUserDto.email && updateUserDto.email !== user.emailValue) {
      const emailExists = await this.userRepository.emailExists(updateUserDto.email);
      if (emailExists) {
        throw new InvalidDataException('Ya existe un usuario con este email');
      }
    }

    // Actualizar campos usando métodos del dominio
    if (updateUserDto.nombre) {
      user.updateNombre(updateUserDto.nombre);
    }

    if (updateUserDto.email) {
      user.updateEmail(updateUserDto.email);
    }

    // Persistir cambios
    const updatedUser = await this.userRepository.update(id, user);

    return {
      id: updatedUser.id,
      nombre: updatedUser.nombre,
      email: updatedUser.emailValue,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
