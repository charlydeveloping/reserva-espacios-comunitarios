import { ValueObject } from '@shared/domain/value-object';
import { InvalidDataException } from '@shared/domain/exceptions';

export enum NotificationTypeEnum {
  RESERVATION_CONFIRMATION = 'RESERVATION_CONFIRMATION',
  RESERVATION_CANCELLATION = 'RESERVATION_CANCELLATION',
  RESERVATION_REMINDER = 'RESERVATION_REMINDER',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
}

export class NotificationType extends ValueObject<NotificationTypeEnum> {
  constructor(value: NotificationTypeEnum) {
    super(value);
  }

  static create(value: string): NotificationType {
    const enumValue = value as NotificationTypeEnum;
    
    if (!Object.values(NotificationTypeEnum).includes(enumValue)) {
      throw new InvalidDataException(
        `Tipo de notificación inválido: ${value}. Tipos válidos: ${Object.values(NotificationTypeEnum).join(', ')}`,
      );
    }

    return new NotificationType(enumValue);
  }

  static reservationConfirmation(): NotificationType {
    return new NotificationType(NotificationTypeEnum.RESERVATION_CONFIRMATION);
  }

  static reservationCancellation(): NotificationType {
    return new NotificationType(NotificationTypeEnum.RESERVATION_CANCELLATION);
  }

  static reservationReminder(): NotificationType {
    return new NotificationType(NotificationTypeEnum.RESERVATION_REMINDER);
  }

  static systemAnnouncement(): NotificationType {
    return new NotificationType(NotificationTypeEnum.SYSTEM_ANNOUNCEMENT);
  }

  isReservationConfirmation(): boolean {
    return this.value === NotificationTypeEnum.RESERVATION_CONFIRMATION;
  }

  isReservationCancellation(): boolean {
    return this.value === NotificationTypeEnum.RESERVATION_CANCELLATION;
  }

  isReservationReminder(): boolean {
    return this.value === NotificationTypeEnum.RESERVATION_REMINDER;
  }

  isSystemAnnouncement(): boolean {
    return this.value === NotificationTypeEnum.SYSTEM_ANNOUNCEMENT;
  }
}
