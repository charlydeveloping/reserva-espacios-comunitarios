import { Test, TestingModule } from '@nestjs/testing';
import { CreateSpaceUseCase } from './create-space.use-case';
import { SpaceRepository } from '../../domain/repositories/space.repository.interface';
import { Space } from '../../domain/entities/space.entity';
import { CreateSpaceDto } from '../dtos/create-space.dto';

/**
 * Pruebas unitarias para el caso de uso CreateSpaceUseCase
 * Caso de uso crítico del sistema de reservas de espacios comunitarios
 */
describe('CreateSpaceUseCase', () => {
  let useCase: CreateSpaceUseCase;
  let mockSpaceRepository: jest.Mocked<SpaceRepository>;

  beforeEach(async () => {
    // Mock del repositorio de espacios
    mockSpaceRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
      findByType: jest.fn(),
      findByCapacityRange: jest.fn(),
      findAvailableSpaces: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSpaceUseCase,
        {
          provide: 'SpaceRepository',
          useValue: mockSpaceRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateSpaceUseCase>(CreateSpaceUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('debe crear un espacio exitosamente cuando los datos son válidos', async () => {
      // Arrange
      const createSpaceDto: CreateSpaceDto = {
        nombre: 'Sala de Reuniones Principal',
        tipo: 'sala_reunion',
        capacidad: 20,
      };

      const mockSpace = Space.create(
        'test-space-id',
        createSpaceDto.nombre,
        createSpaceDto.tipo,
        createSpaceDto.capacidad,
      );

      mockSpaceRepository.save.mockResolvedValue(mockSpace);

      // Act
      const result = await useCase.execute(createSpaceDto);

      // Assert
      expect(mockSpaceRepository.save).toHaveBeenCalledWith(expect.any(Space));
      expect(result).toEqual({
        id: mockSpace.id,
        nombre: mockSpace.nombre,
        tipo: mockSpace.tipoValue,
        capacidad: mockSpace.capacidad,
        createdAt: mockSpace.createdAt,
        updatedAt: mockSpace.updatedAt,
      });
    });

    it('debe llamar al repositorio con una entidad Space correctamente construida', async () => {
      // Arrange
      const createSpaceDto: CreateSpaceDto = {
        nombre: 'Auditorio Central',
        tipo: 'auditorio',
        capacidad: 100,
      };

      const mockSpace = Space.create(
        'test-space-id-2',
        createSpaceDto.nombre,
        createSpaceDto.tipo,
        createSpaceDto.capacidad,
      );

      mockSpaceRepository.save.mockResolvedValue(mockSpace);

      // Act
      await useCase.execute(createSpaceDto);

      // Assert
      expect(mockSpaceRepository.save).toHaveBeenCalledTimes(1);
      
      const savedSpace = mockSpaceRepository.save.mock.calls[0][0];
      expect(savedSpace).toBeInstanceOf(Space);
      expect(savedSpace.nombre).toBe(createSpaceDto.nombre);
      expect(savedSpace.tipoValue).toBe(createSpaceDto.tipo);
      expect(savedSpace.capacidad).toBe(createSpaceDto.capacidad);
    });

    it('debe propagar errores del repositorio', async () => {
      // Arrange
      const createSpaceDto: CreateSpaceDto = {
        nombre: 'Laboratorio de Ciencias',
        tipo: 'laboratorio',
        capacidad: 30,
      };

      const repositoryError = new Error('Error de base de datos');
      mockSpaceRepository.save.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(useCase.execute(createSpaceDto)).rejects.toThrow(repositoryError);
      expect(mockSpaceRepository.save).toHaveBeenCalledTimes(1);
    });

    it('debe crear espacios con diferentes tipos válidos', async () => {
      // Arrange
      const testCases = [
        { nombre: 'Cancha de Fútbol', tipo: 'cancha_deportiva', capacidad: 50 },
        { nombre: 'Biblioteca Central', tipo: 'biblioteca', capacidad: 80 },
        { nombre: 'Salón de Eventos', tipo: 'salon_eventos', capacidad: 150 },
      ];

      for (const testCase of testCases) {
        const mockSpace = Space.create(
          `test-${testCase.tipo}-id`,
          testCase.nombre,
          testCase.tipo,
          testCase.capacidad,
        );

        mockSpaceRepository.save.mockResolvedValue(mockSpace);

        // Act
        const result = await useCase.execute(testCase);

        // Assert
        expect(result.nombre).toBe(testCase.nombre);
        expect(result.tipo).toBe(testCase.tipo);
        expect(result.capacidad).toBe(testCase.capacidad);
      }

      expect(mockSpaceRepository.save).toHaveBeenCalledTimes(testCases.length);
    });

    it('debe generar un ID único para cada espacio creado', async () => {
      // Arrange
      const createSpaceDto: CreateSpaceDto = {
        nombre: 'Patio Central',
        tipo: 'patio',
        capacidad: 200,
      };

      // Capturar los espacios que se intentan guardar
      const savedSpaces: Space[] = [];
      mockSpaceRepository.save.mockImplementation((space: Space) => {
        savedSpaces.push(space);
        return Promise.resolve(space);
      });

      // Act - Crear múltiples espacios
      await useCase.execute(createSpaceDto);
      await useCase.execute(createSpaceDto);

      // Assert
      expect(savedSpaces).toHaveLength(2);
      expect(savedSpaces[0].id).toBeDefined();
      expect(savedSpaces[1].id).toBeDefined();
      expect(savedSpaces[0].id).not.toBe(savedSpaces[1].id);
    });
  });
});
