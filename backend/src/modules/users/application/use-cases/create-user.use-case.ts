import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { InvalidDataException } from '@shared/domain/exceptions';

/**
 * Caso de uso: Crear un nuevo usuario
 * 
 * Responsabilidades:
 * - Validar que el email no esté duplicado
 * - Crear la entidad User con reglas de negocio
 * - Persistir el usuario a través del repositorio
 * - Retornar el DTO de respuesta
 */
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Verificar que el email no esté duplicado
    const emailExists = await this.userRepository.emailExists(createUserDto.email);
    if (emailExists) {
      throw new InvalidDataException('Ya existe un usuario con este email');
    }

    // Crear la entidad del dominio
    const userId = uuidv4();
    const user = User.create(
      userId,
      createUserDto.nombre,
      createUserDto.email,
    );

    // Persistir el usuario
    const savedUser = await this.userRepository.save(user);

    // Retornar DTO de respuesta
    return {
      id: savedUser.id,
      nombre: savedUser.nombre,
      email: savedUser.emailValue,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };
  }
}
