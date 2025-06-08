import { BaseRepository } from '@shared/domain/base-repository.interface';
import { User } from '../entities/user.entity';

/**
 * Puerto (interface) para el repositorio de usuarios
 * Define las operaciones específicas del dominio de usuarios
 */
export interface UserRepository extends BaseRepository<User, string> {
  findByEmail(email: string): Promise<User | null>;
  findByName(name: string): Promise<User[]>;
  emailExists(email: string): Promise<boolean>;
}
