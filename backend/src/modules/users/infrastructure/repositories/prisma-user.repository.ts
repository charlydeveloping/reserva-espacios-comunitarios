import { Injectable } from '@nestjs/common';
import { PrismaService } from '@config/prisma/prisma.service';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

/**
 * Implementación del repositorio de usuarios usando Prisma
 * Adaptador que conecta el dominio con la persistencia
 */
@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userData) {
      return null;
    }

    return User.fromPersistence(
      userData.id,
      userData.nombre,
      userData.email,
      userData.createdAt,
      userData.updatedAt,
    );
  }

  async findAll(): Promise<User[]> {
    const usersData = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return usersData.map(userData =>
      User.fromPersistence(
        userData.id,
        userData.nombre,
        userData.email,
        userData.createdAt,
        userData.updatedAt,
      ),
    );
  }

  async save(user: User): Promise<User> {
    const userData = await this.prisma.user.create({
      data: {
        id: user.id,
        nombre: user.nombre,
        email: user.emailValue,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    return User.fromPersistence(
      userData.id,
      userData.nombre,
      userData.email,
      userData.createdAt,
      userData.updatedAt,
    );
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const userData = await this.prisma.user.update({
      where: { id },
      data: {
        nombre: user.nombre,
        email: user.emailValue,
        updatedAt: new Date(),
      },
    });

    return User.fromPersistence(
      userData.id,
      userData.nombre,
      userData.email,
      userData.createdAt,
      userData.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { id },
    });
    return count > 0;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!userData) {
      return null;
    }

    return User.fromPersistence(
      userData.id,
      userData.nombre,
      userData.email,
      userData.createdAt,
      userData.updatedAt,
    );
  }

  async findByName(name: string): Promise<User[]> {
    const usersData = await this.prisma.user.findMany({
      where: {
        nombre: {
          contains: name,
        },
      },
      orderBy: { nombre: 'asc' },
    });

    return usersData.map(userData =>
      User.fromPersistence(
        userData.id,
        userData.nombre,
        userData.email,
        userData.createdAt,
        userData.updatedAt,
      ),
    );
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }
}
