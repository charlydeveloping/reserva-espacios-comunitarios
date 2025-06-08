import { Module } from '@nestjs/common';
import { UsersController } from './infrastructure/controllers/users.controller';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { GetAllUsersUseCase } from './application/use-cases/get-all-users.use-case';

@Module({
  controllers: [UsersController],
  providers: [
    // Repositorio
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    
    // Casos de uso
    CreateUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    GetAllUsersUseCase,
  ],
  exports: [
    'UserRepository',
    CreateUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    GetAllUsersUseCase,
  ],
})
export class UsersModule {}
