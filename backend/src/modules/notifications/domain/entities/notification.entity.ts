import { BaseEntity } from '@shared/domain/base-entity';
import { NotificationType } from '../value-objects/notification-type.value-object';
import { NotificationStatus } from '../value-objects/notification-status.value-object';
import { InvalidDataException } from '@shared/domain/exceptions';

export class Notification extends BaseEntity {
  constructor(
    id: string,
    private _userId: string,
    private _type: NotificationType,
    private _subject: string,
    private _content: string,
    private _status: NotificationStatus,
    private _sentAt?: Date,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt || new Date(), updatedAt || new Date());
    this.validateBusinessRules();
  }

  get userId(): string {
    return this._userId;
  }

  get type(): NotificationType {
    return this._type;
  }

  get typeValue(): string {
    return this._type.getValue();
  }

  get subject(): string {
    return this._subject;
  }

  get content(): string {
    return this._content;
  }

  get status(): NotificationStatus {
    return this._status;
  }

  get statusValue(): string {
    return this._status.getValue();
  }

  get sentAt(): Date | undefined {
    return this._sentAt;
  }

  // Métodos de negocio
  markAsSent(): void {
    this._status = NotificationStatus.sent();
    this._sentAt = new Date();
    this.touch();
  }

  markAsFailed(): void {
    this._status = NotificationStatus.failed();
    this.touch();
  }

  retry(): void {
    if (!this._status.isFailed()) {
      throw new InvalidDataException('Solo se pueden reintentar notificaciones fallidas');
    }
    
    this._status = NotificationStatus.pending();
    this.touch();
  }

  private validateBusinessRules(): void {
    if (!this._userId) {
      throw new InvalidDataException('El ID del usuario es requerido');
    }

    if (!this._subject || this._subject.trim().length === 0) {
      throw new InvalidDataException('El asunto es requerido');
    }

    if (this._subject.length > 255) {
      throw new InvalidDataException('El asunto no puede exceder 255 caracteres');
    }

    if (!this._content || this._content.trim().length === 0) {
      throw new InvalidDataException('El contenido es requerido');
    }

    if (this._content.length > 2000) {
      throw new InvalidDataException('El contenido no puede exceder 2000 caracteres');
    }
  }

  // Factory method
  static create(
    id: string,
    userId: string,
    type: string,
    subject: string,
    content: string,
  ): Notification {
    return new Notification(
      id,
      userId,
      NotificationType.create(type),
      subject,
      content,
      NotificationStatus.pending(),
    );
  }

  // Para reconstruir desde persistencia
  static fromPersistence(
    id: string,
    userId: string,
    type: string,
    subject: string,
    content: string,
    status: string,
    sentAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
  ): Notification {
    return new Notification(
      id,
      userId,
      NotificationType.create(type),
      subject,
      content,
      NotificationStatus.create(status),
      sentAt || undefined,
      createdAt,
      updatedAt,
    );
  }
}
