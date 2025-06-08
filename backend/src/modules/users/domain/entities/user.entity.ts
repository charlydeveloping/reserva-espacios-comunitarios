import { BaseEntity } from '@shared/domain/base-entity';
import { Email } from '../value-objects/email.value-object';
import { InvalidDataException } from '@shared/domain/exceptions';

export class User extends BaseEntity {
  constructor(
    id: string,
    private _nombre: string,
    private _email: Email,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
    this.validateBusinessRules();
  }

  get nombre(): string {
    return this._nombre;
  }

  get email(): Email {
    return this._email;
  }

  get emailValue(): string {
    return this._email.getValue();
  }

  // Métodos de negocio
  updateNombre(nombre: string): void {
    if (!nombre || nombre.trim().length === 0) {
      throw new InvalidDataException('El nombre es requerido');
    }
    
    if (nombre.length > 100) {
      throw new InvalidDataException('El nombre no puede exceder 100 caracteres');
    }

    this._nombre = nombre.trim();
    this.touch();
  }

  updateEmail(email: string): void {
    this._email = Email.create(email);
    this.touch();
  }

  private validateBusinessRules(): void {
    if (!this._nombre || this._nombre.trim().length === 0) {
      throw new InvalidDataException('El nombre es requerido');
    }

    if (this._nombre.length > 100) {
      throw new InvalidDataException('El nombre no puede exceder 100 caracteres');
    }
  }

  // Factory method
  static create(
    id: string,
    nombre: string,
    email: string,
    createdAt?: Date,
    updatedAt?: Date,
  ): User {
    const now = new Date();
    return new User(
      id,
      nombre,
      Email.create(email),
      createdAt || now,
      updatedAt || now,
    );
  }

  // Para reconstruir desde persistencia
  static fromPersistence(
    id: string,
    nombre: string,
    email: string,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(
      id,
      nombre,
      Email.create(email),
      createdAt,
      updatedAt,
    );
  }
}
