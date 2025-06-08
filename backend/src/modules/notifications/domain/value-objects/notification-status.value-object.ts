import { ValueObject } from '@shared/domain/value-object';
import { InvalidDataException } from '@shared/domain/exceptions';

export enum NotificationStatusEnum {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

export class NotificationStatus extends ValueObject<NotificationStatusEnum> {
  constructor(value: NotificationStatusEnum) {
    super(value);
  }

  static create(value: string): NotificationStatus {
    const enumValue = value as NotificationStatusEnum;
    
    if (!Object.values(NotificationStatusEnum).includes(enumValue)) {
      throw new InvalidDataException(
        `Estado de notificación inválido: ${value}. Estados válidos: ${Object.values(NotificationStatusEnum).join(', ')}`,
      );
    }

    return new NotificationStatus(enumValue);
  }

  static pending(): NotificationStatus {
    return new NotificationStatus(NotificationStatusEnum.PENDING);
  }

  static sent(): NotificationStatus {
    return new NotificationStatus(NotificationStatusEnum.SENT);
  }

  static failed(): NotificationStatus {
    return new NotificationStatus(NotificationStatusEnum.FAILED);
  }

  isPending(): boolean {
    return this.value === NotificationStatusEnum.PENDING;
  }

  isSent(): boolean {
    return this.value === NotificationStatusEnum.SENT;
  }

  isFailed(): boolean {
    return this.value === NotificationStatusEnum.FAILED;
  }
}
