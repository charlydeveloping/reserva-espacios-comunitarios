import { Module } from '@nestjs/common';
import { SpacesController } from './infrastructure/controllers/spaces.controller';
import { PrismaSpaceRepository } from './infrastructure/repositories/prisma-space.repository';
import { CreateSpaceUseCase } from './application/use-cases/create-space.use-case';
import { GetAllSpacesUseCase } from './application/use-cases/get-all-spaces.use-case';
import { GetAvailableSpacesUseCase } from './application/use-cases/get-available-spaces.use-case';
import { GetSpaceByIdUseCase } from './application/use-cases/get-space-by-id.use-case';

@Module({
  controllers: [SpacesController],
  providers: [
    // Repositorio
    {
      provide: 'SpaceRepository',
      useClass: PrismaSpaceRepository,
    },
    
    // Casos de uso
    CreateSpaceUseCase,
    GetAllSpacesUseCase,
    GetAvailableSpacesUseCase,
    GetSpaceByIdUseCase,
  ],
  exports: [
    'SpaceRepository',
    CreateSpaceUseCase,
    GetAllSpacesUseCase,
    GetAvailableSpacesUseCase,
    GetSpaceByIdUseCase,
  ],
})
export class SpacesModule {}
