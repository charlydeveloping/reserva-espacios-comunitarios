import { BaseRepository } from '@shared/domain/base-repository.interface';
import { Space } from '../entities/space.entity';

/**
 * Puerto (interface) para el repositorio de espacios
 */
export interface SpaceRepository extends BaseRepository<Space, string> {
  findByType(type: string): Promise<Space[]>;
  findByCapacityRange(minCapacity: number, maxCapacity?: number): Promise<Space[]>;
  findAvailableSpaces(date: Date, startTime: Date, endTime: Date): Promise<Space[]>;
}
