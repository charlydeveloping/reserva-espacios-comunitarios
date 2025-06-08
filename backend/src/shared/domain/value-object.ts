/**
 * Clase base para Value Objects
 * Los Value Objects son inmutables y se comparan por valor
 */
export abstract class ValueObject<T> {
  constructor(protected readonly value: T) {}

  getValue(): T {
    return this.value;
  }

  equals(other: ValueObject<T>): boolean {
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }

  toString(): string {
    return String(this.value);
  }
}
