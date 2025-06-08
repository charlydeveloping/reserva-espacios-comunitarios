import { BaseEntity } from '@shared/domain/base-entity';
import { ReservationStatus } from '../value-objects/reservation-status.value-object';
import { InvalidDataException, BusinessRuleViolationException } from '@shared/domain/exceptions';

export class Reservation extends BaseEntity {
  constructor(
    id: string,
    private _usuarioId: string,
    private _espacioId: string,
    private _fecha: Date,
    private _horaInicio: Date,
    private _horaFin: Date,
    private _estado: ReservationStatus,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
    this.validateBusinessRules();
  }

  get usuarioId(): string {
    return this._usuarioId;
  }

  get espacioId(): string {
    return this._espacioId;
  }

  get fecha(): Date {
    return this._fecha;
  }

  get horaInicio(): Date {
    return this._horaInicio;
  }

  get horaFin(): Date {
    return this._horaFin;
  }

  get estado(): ReservationStatus {
    return this._estado;
  }

  get estadoValue(): string {
    return this._estado.getValue();
  }

  // Métodos de negocio
  confirm(): void {
    if (!this._estado.canBeConfirmed()) {
      throw new BusinessRuleViolationException(
        'Solo las reservas pendientes pueden ser confirmadas',
      );
    }

    this._estado = ReservationStatus.confirmed();
    this.touch();
  }

  cancel(): void {
    if (!this._estado.canBeCancelled()) {
      throw new BusinessRuleViolationException(
        'Solo las reservas pendientes o confirmadas pueden ser canceladas',
      );
    }

    this._estado = ReservationStatus.cancelled();
    this.touch();
  }

  complete(): void {
    if (!this._estado.canBeCompleted()) {
      throw new BusinessRuleViolationException(
        'Solo las reservas confirmadas pueden ser completadas',
      );
    }

    this._estado = ReservationStatus.completed();
    this.touch();
  }

  // Reglas de negocio
  isActive(): boolean {
    return this._estado.isPending() || this._estado.isConfirmed();
  }

  getDuration(): number {
    return this._horaFin.getTime() - this._horaInicio.getTime();
  }

  getDurationInHours(): number {
    return this.getDuration() / (1000 * 60 * 60);
  }

  isInFuture(): boolean {
    return this._fecha > new Date();
  }

  conflictsWith(otherReservation: Reservation): boolean {
    if (this._espacioId !== otherReservation._espacioId) {
      return false;
    }

    if (this._fecha.toDateString() !== otherReservation._fecha.toDateString()) {
      return false;
    }

    // Si alguna de las dos está cancelada, no hay conflicto
    if (this._estado.isCancelled() || otherReservation._estado.isCancelled()) {
      return false;
    }

    // Verificar solapamiento de horarios
    return (
      (this._horaInicio < otherReservation._horaFin) &&
      (this._horaFin > otherReservation._horaInicio)
    );
  }

  private validateBusinessRules(): void {
    if (!this._usuarioId) {
      throw new InvalidDataException('El ID del usuario es requerido');
    }

    if (!this._espacioId) {
      throw new InvalidDataException('El ID del espacio es requerido');
    }

    if (!this._fecha) {
      throw new InvalidDataException('La fecha es requerida');
    }

    if (!this._horaInicio) {
      throw new InvalidDataException('La hora de inicio es requerida');
    }

    if (!this._horaFin) {
      throw new InvalidDataException('La hora de fin es requerida');
    }

    if (this._horaInicio >= this._horaFin) {
      throw new InvalidDataException('La hora de inicio debe ser menor a la hora de fin');
    }

    // No permitir reservas de más de 8 horas
    const maxDurationHours = 8;
    if (this.getDurationInHours() > maxDurationHours) {
      throw new BusinessRuleViolationException(
        `La duración de la reserva no puede exceder ${maxDurationHours} horas`,
      );
    }

    // No permitir reservas de menos de 30 minutos
    const minDurationMinutes = 30;
    if (this.getDuration() < minDurationMinutes * 60 * 1000) {
      throw new BusinessRuleViolationException(
        `La duración mínima de la reserva es ${minDurationMinutes} minutos`,
      );
    }

    // No permitir reservas en el pasado
    const now = new Date();
    const reservationDateTime = new Date(this._fecha);
    reservationDateTime.setHours(this._horaInicio.getHours(), this._horaInicio.getMinutes(), 0, 0);
    
    if (reservationDateTime <= now) {
      throw new BusinessRuleViolationException(
        'No se pueden hacer reservas en fechas pasadas',
      );
    }
  }

  // Factory method
  static create(
    id: string,
    usuarioId: string,
    espacioId: string,
    fecha: Date,
    horaInicio: Date,
    horaFin: Date,
    createdAt?: Date,
    updatedAt?: Date,
  ): Reservation {
    const now = new Date();
    return new Reservation(
      id,
      usuarioId,
      espacioId,
      fecha,
      horaInicio,
      horaFin,
      ReservationStatus.pending(),
      createdAt || now,
      updatedAt || now,
    );
  }

  // Para reconstruir desde persistencia
  static fromPersistence(
    id: string,
    usuarioId: string,
    espacioId: string,
    fecha: Date,
    horaInicio: Date,
    horaFin: Date,
    estado: string,
    createdAt: Date,
    updatedAt: Date,
  ): Reservation {
    return new Reservation(
      id,
      usuarioId,
      espacioId,
      fecha,
      horaInicio,
      horaFin,
      ReservationStatus.create(estado),
      createdAt,
      updatedAt,
    );
  }
}
