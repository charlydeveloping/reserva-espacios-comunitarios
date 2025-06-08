import { BaseEntity } from '@shared/domain/base-entity';
import { SpaceType } from '../value-objects/space-type.value-object';
import { InvalidDataException } from '@shared/domain/exceptions';

export class Space extends BaseEntity {
  constructor(
    id: string,
    private _nombre: string,
    private _tipo: SpaceType,
    private _capacidad: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
    this.validateBusinessRules();
  }

  get nombre(): string {
    return this._nombre;
  }

  get tipo(): SpaceType {
    return this._tipo;
  }

  get tipoValue(): string {
    return this._tipo.getValue();
  }

  get capacidad(): number {
    return this._capacidad;
  }

  // Métodos de negocio
  updateNombre(nombre: string): void {
    if (!nombre || nombre.trim().length === 0) {
      throw new InvalidDataException('El nombre del espacio es requerido');
    }
    
    if (nombre.length > 100) {
      throw new InvalidDataException('El nombre no puede exceder 100 caracteres');
    }

    this._nombre = nombre.trim();
    this.touch();
  }

  updateTipo(tipo: string): void {
    this._tipo = SpaceType.create(tipo);
    this.touch();
  }

  updateCapacidad(capacidad: number): void {
    if (!capacidad || capacidad <= 0) {
      throw new InvalidDataException('La capacidad debe ser mayor a 0');
    }

    if (capacidad > 1000) {
      throw new InvalidDataException('La capacidad no puede exceder 1000 personas');
    }

    this._capacidad = capacidad;
    this.touch();
  }

  // Reglas de negocio
  isAvailable(): boolean {
    // En una implementación real, aquí se verificaría el estado del espacio
    return true;
  }

  canAccommodate(requiredCapacity: number): boolean {
    return this._capacidad >= requiredCapacity;
  }

  private validateBusinessRules(): void {
    if (!this._nombre || this._nombre.trim().length === 0) {
      throw new InvalidDataException('El nombre del espacio es requerido');
    }

    if (this._nombre.length > 100) {
      throw new InvalidDataException('El nombre no puede exceder 100 caracteres');
    }

    if (!this._capacidad || this._capacidad <= 0) {
      throw new InvalidDataException('La capacidad debe ser mayor a 0');
    }

    if (this._capacidad > 1000) {
      throw new InvalidDataException('La capacidad no puede exceder 1000 personas');
    }
  }

  // Factory method
  static create(
    id: string,
    nombre: string,
    tipo: string,
    capacidad: number,
    createdAt?: Date,
    updatedAt?: Date,
  ): Space {
    const now = new Date();
    return new Space(
      id,
      nombre,
      SpaceType.create(tipo),
      capacidad,
      createdAt || now,
      updatedAt || now,
    );
  }

  // Para reconstruir desde persistencia
  static fromPersistence(
    id: string,
    nombre: string,
    tipo: string,
    capacidad: number,
    createdAt: Date,
    updatedAt: Date,
  ): Space {
    return new Space(
      id,
      nombre,
      SpaceType.create(tipo),
      capacidad,
      createdAt,
      updatedAt,
    );
  }
}
