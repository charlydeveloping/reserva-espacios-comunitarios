/**
 * Excepciones personalizadas del dominio
 */

export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, id: string) {
    super(`${entityName} con ID ${id} no encontrado`);
    this.name = 'EntityNotFoundException';
  }
}

export class InvalidDataException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDataException';
  }
}

export class BusinessRuleViolationException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessRuleViolationException';
  }
}
