import { ValueObject } from '@shared/domain/value-object';
import { InvalidDataException } from '@shared/domain/exceptions';

export enum ReservationStatusEnum {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export class ReservationStatus extends ValueObject<ReservationStatusEnum> {
  constructor(value: ReservationStatusEnum) {
    super(value);
  }

  static create(value: string): ReservationStatus {
    const enumValue = value as ReservationStatusEnum;
    
    if (!Object.values(ReservationStatusEnum).includes(enumValue)) {
      throw new InvalidDataException(
        `Estado de reserva inválido: ${value}. Estados válidos: ${Object.values(ReservationStatusEnum).join(', ')}`,
      );
    }

    return new ReservationStatus(enumValue);
  }

  static pending(): ReservationStatus {
    return new ReservationStatus(ReservationStatusEnum.PENDING);
  }

  static confirmed(): ReservationStatus {
    return new ReservationStatus(ReservationStatusEnum.CONFIRMED);
  }

  static cancelled(): ReservationStatus {
    return new ReservationStatus(ReservationStatusEnum.CANCELLED);
  }

  static completed(): ReservationStatus {
    return new ReservationStatus(ReservationStatusEnum.COMPLETED);
  }

  isPending(): boolean {
    return this.value === ReservationStatusEnum.PENDING;
  }

  isConfirmed(): boolean {
    return this.value === ReservationStatusEnum.CONFIRMED;
  }

  isCancelled(): boolean {
    return this.value === ReservationStatusEnum.CANCELLED;
  }

  isCompleted(): boolean {
    return this.value === ReservationStatusEnum.COMPLETED;
  }

  canBeConfirmed(): boolean {
    return this.isPending();
  }

  canBeCancelled(): boolean {
    return this.isPending() || this.isConfirmed();
  }

  canBeCompleted(): boolean {
    return this.isConfirmed();
  }
}
