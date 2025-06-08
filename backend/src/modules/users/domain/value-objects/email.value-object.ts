import { ValueObject } from '@shared/domain/value-object';
import { InvalidDataException } from '@shared/domain/exceptions';

export class Email extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.validate();
  }

  private validate(): void {
    if (!this.value) {
      throw new InvalidDataException('El email es requerido');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
      throw new InvalidDataException('El formato del email es inválido');
    }

    if (this.value.length > 255) {
      throw new InvalidDataException('El email no puede exceder 255 caracteres');
    }
  }

  static create(value: string): Email {
    return new Email(value);
  }
}
