import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '../../../src/modules/users/application/use-cases/create-user.use-case';
import { UserRepository } from '../../../src/modules/users/domain/repositories/user.repository.interface';
import { User } from '../../../src/modules/users/domain/entities/user.entity';
import { CreateUserDto } from '../../../src/modules/users/application/dtos/create-user.dto';
import { InvalidDataException } from '../../../src/shared/domain/exceptions';

/**
 * Pruebas unitarias para el caso de uso CreateUser
 * Demuestra cómo la arquitectura hexagonal facilita el testing
 */
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    // Mock del repositorio
    mockUserRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
      findByEmail: jest.fn(),
      findByName: jest.fn(),
      emailExists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  describe('execute', () => {
    it('debe crear un usuario cuando los datos son válidos', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        nombre: 'Juan Pérez',
        email: 'juan.perez@test.com',
      };

      const mockUser = User.create(
        'test-id',
        createUserDto.nombre,
        createUserDto.email,
      );

      mockUserRepository.emailExists.mockResolvedValue(false);
      mockUserRepository.save.mockResolvedValue(mockUser);

      // Act
      const result = await useCase.execute(createUserDto);

      // Assert
      expect(mockUserRepository.emailExists).toHaveBeenCalledWith(createUserDto.email);
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
      expect(result).toEqual({
        id: mockUser.id,
        nombre: mockUser.nombre,
        email: mockUser.emailValue,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('debe lanzar excepción cuando el email ya existe', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        nombre: 'Juan Pérez',
        email: 'juan.perez@test.com',
      };

      mockUserRepository.emailExists.mockResolvedValue(true);

      // Act & Assert
      await expect(useCase.execute(createUserDto)).rejects.toThrow(
        new InvalidDataException('Ya existe un usuario con este email'),
      );

      expect(mockUserRepository.emailExists).toHaveBeenCalledWith(createUserDto.email);
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('debe validar formato de email a través de la entidad', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        nombre: 'Juan Pérez',
        email: 'email-invalido',
      };

      mockUserRepository.emailExists.mockResolvedValue(false);

      // Act & Assert
      await expect(useCase.execute(createUserDto)).rejects.toThrow(
        new InvalidDataException('El formato del email es inválido'),
      );

      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('debe validar nombre requerido a través de la entidad', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        nombre: '',
        email: 'juan.perez@test.com',
      };

      mockUserRepository.emailExists.mockResolvedValue(false);

      // Act & Assert
      await expect(useCase.execute(createUserDto)).rejects.toThrow(
        new InvalidDataException('El nombre es requerido'),
      );

      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });
});
