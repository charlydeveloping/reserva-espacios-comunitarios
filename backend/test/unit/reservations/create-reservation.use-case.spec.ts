import { Test, TestingModule } from '@nestjs/testing';
import { CreateReservationUseCase } from '../../../src/modules/reservations/application/use-cases/create-reservation.use-case';
import { ReservationRepository } from '../../../src/modules/reservations/domain/repositories/reservation.repository.interface';
import { UserRepository } from '../../../src/modules/users/domain/repositories/user.repository.interface';
import { SpaceRepository } from '../../../src/modules/spaces/domain/repositories/space.repository.interface';
import { NotificationPort } from '../../../src/modules/reservations/application/ports/notification.port';
import { User } from '../../../src/modules/users/domain/entities/user.entity';
import { Space } from '../../../src/modules/spaces/domain/entities/space.entity';
import { Reservation } from '../../../src/modules/reservations/domain/entities/reservation.entity';
import { CreateReservationDto } from '../../../src/modules/reservations/application/dtos/create-reservation.dto';
import { EntityNotFoundException, BusinessRuleViolationException } from '../../../src/shared/domain/exceptions';

/**
 * Pruebas unitarias para el caso de uso CreateReservation
 * Demuestra la testabilidad de la arquitectura hexagonal
 */
describe('CreateReservationUseCase', () => {
  let useCase: CreateReservationUseCase;
  let mockReservationRepository: jest.Mocked<ReservationRepository>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockSpaceRepository: jest.Mocked<SpaceRepository>;
  let mockNotificationService: jest.Mocked<NotificationPort>;

  beforeEach(async () => {
    // Mocks de repositorios y servicios
    mockReservationRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
      findByUserId: jest.fn(),
      findBySpaceId: jest.fn(),
      findByDateRange: jest.fn(),
      findConflictingReservations: jest.fn(),
      findActiveReservations: jest.fn(),
      findByStatus: jest.fn(),
    };

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

    mockNotificationService = {
      sendReservationConfirmation: jest.fn(),
      sendReservationCancellation: jest.fn(),
      sendReservationReminder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateReservationUseCase,
        {
          provide: 'ReservationRepository',
          useValue: mockReservationRepository,
        },
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: 'SpaceRepository',
          useValue: mockSpaceRepository,
        },
        {
          provide: 'NotificationPort',
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    useCase = module.get<CreateReservationUseCase>(CreateReservationUseCase);
  });

  describe('execute', () => {
    const createReservationDto: CreateReservationDto = {
      usuarioId: 'user-123',
      espacioId: 'space-456',
      fecha: '2024-12-15',
      horaInicio: '09:00',
      horaFin: '11:00',
    };

    it('debe crear una reserva cuando los datos son válidos', async () => {
      // Arrange
      const mockUser = User.create('user-123', 'Juan Pérez', 'juan@test.com');
      const mockSpace = Space.create('space-456', 'Sala de Reuniones', 'sala_reunion', 20);
      const mockReservation = Reservation.create(
        'reservation-789',
        createReservationDto.usuarioId,
        createReservationDto.espacioId,
        new Date(createReservationDto.fecha),
        new Date(`${createReservationDto.fecha}T${createReservationDto.horaInicio}:00`),
        new Date(`${createReservationDto.fecha}T${createReservationDto.horaFin}:00`),
      );

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockSpaceRepository.findById.mockResolvedValue(mockSpace);
      mockReservationRepository.findConflictingReservations.mockResolvedValue([]);
      mockReservationRepository.save.mockResolvedValue(mockReservation);
      mockNotificationService.sendReservationConfirmation.mockResolvedValue();

      // Act
      const result = await useCase.execute(createReservationDto);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(createReservationDto.usuarioId);
      expect(mockSpaceRepository.findById).toHaveBeenCalledWith(createReservationDto.espacioId);
      expect(mockReservationRepository.findConflictingReservations).toHaveBeenCalled();
      expect(mockReservationRepository.save).toHaveBeenCalledWith(expect.any(Reservation));
      expect(mockNotificationService.sendReservationConfirmation).toHaveBeenCalled();
      
      expect(result.id).toBeDefined();
      expect(result.usuarioId).toBe(createReservationDto.usuarioId);
      expect(result.espacioId).toBe(createReservationDto.espacioId);
      expect(result.estado).toBe('PENDING');
    });

    it('debe lanzar excepción cuando el usuario no existe', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(createReservationDto)).rejects.toThrow(
        new EntityNotFoundException('Usuario', createReservationDto.usuarioId),
      );

      expect(mockUserRepository.findById).toHaveBeenCalledWith(createReservationDto.usuarioId);
      expect(mockSpaceRepository.findById).not.toHaveBeenCalled();
      expect(mockReservationRepository.save).not.toHaveBeenCalled();
    });

    it('debe lanzar excepción cuando el espacio no existe', async () => {
      // Arrange
      const mockUser = User.create('user-123', 'Juan Pérez', 'juan@test.com');
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockSpaceRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(createReservationDto)).rejects.toThrow(
        new EntityNotFoundException('Espacio', createReservationDto.espacioId),
      );

      expect(mockSpaceRepository.findById).toHaveBeenCalledWith(createReservationDto.espacioId);
      expect(mockReservationRepository.save).not.toHaveBeenCalled();
    });

    it('debe lanzar excepción cuando hay conflicto de horario', async () => {
      // Arrange
      const mockUser = User.create('user-123', 'Juan Pérez', 'juan@test.com');
      const mockSpace = Space.create('space-456', 'Sala de Reuniones', 'sala_reunion', 20);
      const conflictingReservation = Reservation.create(
        'existing-reservation',
        'other-user',
        createReservationDto.espacioId,
        new Date(createReservationDto.fecha),
        new Date(`${createReservationDto.fecha}T08:30:00`),
        new Date(`${createReservationDto.fecha}T10:30:00`),
      );

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockSpaceRepository.findById.mockResolvedValue(mockSpace);
      mockReservationRepository.findConflictingReservations.mockResolvedValue([conflictingReservation]);

      // Act & Assert
      await expect(useCase.execute(createReservationDto)).rejects.toThrow(
        new BusinessRuleViolationException(
          'Ya existe una reserva confirmada o pendiente en este horario para el espacio seleccionado',
        ),
      );

      expect(mockReservationRepository.findConflictingReservations).toHaveBeenCalled();
      expect(mockReservationRepository.save).not.toHaveBeenCalled();
    });

    it('debe manejar errores de notificación sin fallar la reserva', async () => {
      // Arrange
      const mockUser = User.create('user-123', 'Juan Pérez', 'juan@test.com');
      const mockSpace = Space.create('space-456', 'Sala de Reuniones', 'sala_reunion', 20);
      const mockReservation = Reservation.create(
        'reservation-789',
        createReservationDto.usuarioId,
        createReservationDto.espacioId,
        new Date(createReservationDto.fecha),
        new Date(`${createReservationDto.fecha}T${createReservationDto.horaInicio}:00`),
        new Date(`${createReservationDto.fecha}T${createReservationDto.horaFin}:00`),
      );

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockSpaceRepository.findById.mockResolvedValue(mockSpace);
      mockReservationRepository.findConflictingReservations.mockResolvedValue([]);
      mockReservationRepository.save.mockResolvedValue(mockReservation);
      mockNotificationService.sendReservationConfirmation.mockRejectedValue(new Error('Email service error'));

      // Espía console.warn para verificar que se loggea el error
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Act
      const result = await useCase.execute(createReservationDto);

      // Assert
      expect(result.id).toBeDefined();
      expect(mockReservationRepository.save).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Error al enviar notificación:', 'Email service error');

      consoleSpy.mockRestore();
    });
  });
});
