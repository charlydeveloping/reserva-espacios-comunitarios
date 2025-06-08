/**
 * Entidad base para todas las entidades del dominio
 * Implementa los principios de DDD (Domain-Driven Design)
 */
export abstract class BaseEntity {
  constructor(
    protected readonly _id: string,
    protected readonly _createdAt: Date,
    protected _updatedAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }

  equals(other: BaseEntity): boolean {
    return this._id === other._id;
  }
}
