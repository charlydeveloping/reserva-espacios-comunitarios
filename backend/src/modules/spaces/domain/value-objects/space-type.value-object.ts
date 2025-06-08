import { ValueObject } from '@shared/domain/value-object';
import { InvalidDataException } from '@shared/domain/exceptions';

export class SpaceType extends ValueObject<string> {
  private static readonly VALID_TYPES = [
    'sala_reunion',
    'cancha_deportiva',
    'auditorio',
    'salon_eventos',
    'laboratorio',
    'biblioteca',
    'patio',
    'gimnasio',
  ];

  constructor(value: string) {
    super(value);
    this.validate();
  }

  private validate(): void {
    if (!this.value) {
      throw new InvalidDataException('El tipo de espacio es requerido');
    }

    if (!SpaceType.VALID_TYPES.includes(this.value)) {
      throw new InvalidDataException(
        `Tipo de espacio inválido. Tipos válidos: ${SpaceType.VALID_TYPES.join(', ')}`,
      );
    }
  }

  static create(value: string): SpaceType {
    return new SpaceType(value);
  }

  static getValidTypes(): string[] {
    return [...SpaceType.VALID_TYPES];
  }
}
