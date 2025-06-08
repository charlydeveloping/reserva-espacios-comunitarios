import { Notification } from '../../../src/modules/notifications/domain/entities/notification.entity';
import { InvalidDataException } from '../../../src/shared/domain/exceptions';

/**
 * Pruebas unitarias para la entidad Notification
 * Demuestra las reglas de negocio del dominio
 */
describe('Notification Entity', () => {
  describe('create', () => {
    it('debe crear una notificación válida', () => {
      // Act
      const notification = Notification.create(
        'notification-123',
        'user-456',
        'RESERVATION_CONFIRMATION',
        'Confirmación de Reserva',
        'Su reserva ha sido confirmada exitosamente.',
      );

      // Assert
      expect(notification.id).toBe('notification-123');
      expect(notification.userId).toBe('user-456');
      expect(notification.typeValue).toBe('RESERVATION_CONFIRMATION');
      expect(notification.subject).toBe('Confirmación de Reserva');
      expect(notification.content).toBe('Su reserva ha sido confirmada exitosamente.');
      expect(notification.statusValue).toBe('PENDING');
      expect(notification.sentAt).toBeUndefined();
    });

    it('debe lanzar excepción con userId vacío', () => {
      // Act & Assert
      expect(() => {
        Notification.create(
          'notification-123',
          '',
          'RESERVATION_CONFIRMATION',
          'Confirmación de Reserva',
          'Su reserva ha sido confirmada.',
        );
      }).toThrow(new InvalidDataException('El ID del usuario es requerido'));
    });

    it('debe lanzar excepción con asunto vacío', () => {
      // Act & Assert
      expect(() => {
        Notification.create(
          'notification-123',
          'user-456',
          'RESERVATION_CONFIRMATION',
          '',
          'Su reserva ha sido confirmada.',
        );
      }).toThrow(new InvalidDataException('El asunto es requerido'));
    });

    it('debe lanzar excepción con contenido vacío', () => {
      // Act & Assert
      expect(() => {
        Notification.create(
          'notification-123',
          'user-456',
          'RESERVATION_CONFIRMATION',
          'Confirmación de Reserva',
          '',
        );
      }).toThrow(new InvalidDataException('El contenido es requerido'));
    });

    it('debe lanzar excepción con asunto muy largo', () => {
      // Arrange
      const longSubject = 'a'.repeat(256);

      // Act & Assert
      expect(() => {
        Notification.create(
          'notification-123',
          'user-456',
          'RESERVATION_CONFIRMATION',
          longSubject,
          'Contenido válido',
        );
      }).toThrow(new InvalidDataException('El asunto no puede exceder 255 caracteres'));
    });

    it('debe lanzar excepción con contenido muy largo', () => {
      // Arrange
      const longContent = 'a'.repeat(2001);

      // Act & Assert
      expect(() => {
        Notification.create(
          'notification-123',
          'user-456',
          'RESERVATION_CONFIRMATION',
          'Asunto válido',
          longContent,
        );
      }).toThrow(new InvalidDataException('El contenido no puede exceder 2000 caracteres'));
    });
  });

  describe('markAsSent', () => {
    it('debe marcar la notificación como enviada', () => {
      // Arrange
      const notification = Notification.create(
        'notification-123',
        'user-456',
        'RESERVATION_CONFIRMATION',
        'Confirmación de Reserva',
        'Su reserva ha sido confirmada.',
      );

      // Act
      notification.markAsSent();

      // Assert
      expect(notification.statusValue).toBe('SENT');
      expect(notification.sentAt).toBeDefined();
      expect(notification.sentAt).toBeInstanceOf(Date);
    });
  });

  describe('markAsFailed', () => {
    it('debe marcar la notificación como fallida', () => {
      // Arrange
      const notification = Notification.create(
        'notification-123',
        'user-456',
        'RESERVATION_CONFIRMATION',
        'Confirmación de Reserva',
        'Su reserva ha sido confirmada.',
      );

      // Act
      notification.markAsFailed();

      // Assert
      expect(notification.statusValue).toBe('FAILED');
    });
  });

  describe('retry', () => {
    it('debe permitir reintentar una notificación fallida', () => {
      // Arrange
      const notification = Notification.create(
        'notification-123',
        'user-456',
        'RESERVATION_CONFIRMATION',
        'Confirmación de Reserva',
        'Su reserva ha sido confirmada.',
      );
      notification.markAsFailed();

      // Act
      notification.retry();

      // Assert
      expect(notification.statusValue).toBe('PENDING');
    });

    it('debe lanzar excepción al reintentar una notificación no fallida', () => {
      // Arrange
      const notification = Notification.create(
        'notification-123',
        'user-456',
        'RESERVATION_CONFIRMATION',
        'Confirmación de Reserva',
        'Su reserva ha sido confirmada.',
      );
      notification.markAsSent();

      // Act & Assert
      expect(() => {
        notification.retry();
      }).toThrow(new InvalidDataException('Solo se pueden reintentar notificaciones fallidas'));
    });
  });

  describe('fromPersistence', () => {
    it('debe reconstruir una notificación desde persistencia', () => {
      // Arrange
      const sentDate = new Date('2024-01-15T10:30:00Z');
      const createdDate = new Date('2024-01-15T10:00:00Z');
      const updatedDate = new Date('2024-01-15T10:30:00Z');

      // Act
      const notification = Notification.fromPersistence(
        'notification-123',
        'user-456',
        'RESERVATION_CONFIRMATION',
        'Confirmación de Reserva',
        'Su reserva ha sido confirmada.',
        'SENT',
        sentDate,
        createdDate,
        updatedDate,
      );

      // Assert
      expect(notification.id).toBe('notification-123');
      expect(notification.userId).toBe('user-456');
      expect(notification.typeValue).toBe('RESERVATION_CONFIRMATION');
      expect(notification.statusValue).toBe('SENT');
      expect(notification.sentAt).toBe(sentDate);
      expect(notification.createdAt).toBe(createdDate);
      expect(notification.updatedAt).toBe(updatedDate);
    });
  });
});
