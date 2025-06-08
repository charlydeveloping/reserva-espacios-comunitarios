# Backend - Sistema de Reserva de Espacios Comunitarios

Backend desarrollado con **NestJS** siguiendo **Arquitectura Hexagonal** y principios de **Domain-Driven Design (DDD)**.

## 🏗️ Arquitectura

### Principios Aplicados

- **Arquitectura Hexagonal (Ports & Adapters)**
- **Domain-Driven Design (DDD)**
- **Clean Architecture**
- **SOLID Principles**
- **Dependency Inversion**

### Estructura de Capas

```
application/     # Casos de uso y lógica de aplicación
domain/         # Entidades, reglas de negocio y contratos
infrastructure/ # Implementaciones concretas y adaptadores
```

## 📊 Casos de Uso Críticos

### 1. CreateReservationUseCase 🎯

**Ubicación**: `src/modules/reservations/application/use-cases/create-reservation.use-case.ts`
**Test**: `test/unit/reservations/create-reservation.use-case.spec.ts`

**Reglas de Negocio Implementadas**:
- ✅ Verificar existencia del usuario
- ✅ Verificar existencia del espacio
- ✅ Detectar conflictos de horario
- ✅ Crear reserva con estado PENDING
- ✅ Enviar notificación de confirmación
- ✅ Validar duración máxima (8 horas)
- ✅ Validar horarios lógicos (inicio < fin)

```bash
# Ejecutar test específico
npm test -- test/unit/reservations/create-reservation.use-case.spec.ts

# Con cobertura
npm test -- test/unit/reservations/create-reservation.use-case.spec.ts --coverage
```

### 2. CreateSpaceUseCase

**Ubicación**: `src/modules/spaces/application/use-cases/create-space.use-case.ts`
**Test**: `src/modules/spaces/application/use-cases/create-space.use-case.spec.ts`

**Validaciones**:
- ✅ Tipos de espacio válidos
- ✅ Capacidad entre 1-1000 personas
- ✅ Nombre requerido y máximo 100 caracteres
- ✅ Generación de IDs únicos

```bash
# Ejecutar test específico
npm test -- src/modules/spaces/application/use-cases/create-space.use-case.spec.ts
```

### 3. CreateUserUseCase

**Ubicación**: `src/modules/users/application/use-cases/create-user.use-case.ts`
**Test**: `test/unit/users/create-user.use-case.spec.ts`

**Validaciones**:
- ✅ Email único en el sistema
- ✅ Formato de email válido
- ✅ Nombre requerido

```bash
# Ejecutar test específico
npm test -- test/unit/users/create-user.use-case.spec.ts
```

## 🧪 Estrategia de Testing

### Tipos de Tests

1. **Tests Unitarios**: Casos de uso y entidades de dominio
2. **Tests de Integración**: Controladores y repositorios
3. **Tests E2E**: Flujos completos de la aplicación

### Comandos de Testing

```bash
# Todos los tests
npm test

# Tests unitarios específicos
npm test -- --testPathPattern="unit"

# Tests de integración
npm test -- --testPathPattern="integration"

# Tests E2E
npm run test:e2e

# Con cobertura
npm run test:cov

# Modo watch (recomendado para desarrollo)
npm run test:watch

# Debug de tests
npm run test:debug
```

### Cobertura de Código

```bash
# Generar reporte de cobertura
npm run test:cov

# Ver reporte en navegador
open coverage/lcov-report/index.html
```

## 🗄️ Base de Datos

### Gestión con Prisma

```bash
# Generar cliente después de cambios en schema
npm run db:generate

# Crear nueva migración
npm run db:migrate

# Aplicar migraciones (producción)
npm run db:deploy

# Poblar con datos de prueba
npm run db:seed

# Ver datos en interfaz gráfica
npm run db:studio

# Resetear base de datos (⚠️ DESTRUCTIVO)
npm run db:reset
```

### Esquema de Datos

**Entidades Principales**:
- `User`: Usuarios del sistema
- `Space`: Espacios comunitarios
- `Reservation`: Reservas de espacios
- `Notification`: Notificaciones del sistema

**Tipos de Espacios Soportados**:
- `sala_reunion`: Salas de reuniones
- `auditorio`: Auditorios
- `cancha_deportiva`: Canchas deportivas
- `salon_eventos`: Salones de eventos
- `laboratorio`: Laboratorios
- `biblioteca`: Bibliotecas
- `patio`: Patios
- `gimnasio`: Gimnasios

## 🔌 API REST

### Endpoints Principales

**Espacios**:
- `GET /api/spaces` - Listar espacios
- `GET /api/spaces/:id` - Obtener espacio por ID
- `GET /api/spaces/available` - Espacios disponibles
- `POST /api/spaces` - Crear espacio

**Reservas**:
- `GET /api/reservations` - Listar reservas
- `GET /api/reservations/:id` - Obtener reserva por ID
- `POST /api/reservations` - Crear reserva
- `PATCH /api/reservations/:id/confirm` - Confirmar reserva
- `PATCH /api/reservations/:id/cancel` - Cancelar reserva

**Usuarios**:
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear usuario

### Documentación API

La documentación interactiva está disponible en:
`http://localhost:3000/api/docs`

## 🏛️ Arquitectura Detallada

### Módulo de Reservations (Core del Sistema)

```
reservations/
├── application/
│   ├── dtos/
│   │   ├── create-reservation.dto.ts
│   │   ├── reservation-response.dto.ts
│   │   └── reservation-full-response.dto.ts
│   ├── ports/
│   │   └── notification.port.ts          # Puerto para notificaciones
│   ├── services/
│   │   └── reservation-mapping.service.ts
│   └── use-cases/
│       ├── create-reservation.use-case.ts    # 🎯 Caso crítico
│       ├── confirm-reservation.use-case.ts
│       ├── cancel-reservation.use-case.ts
│       └── get-user-reservations.use-case.ts
├── domain/
│   ├── entities/
│   │   └── reservation.entity.ts        # Entidad raíz del agregado
│   ├── repositories/
│   │   └── reservation.repository.interface.ts
│   └── value-objects/
│       └── reservation-status.value-object.ts
└── infrastructure/
    ├── adapters/
    │   └── email-notification.adapter.ts
    ├── controllers/
    │   └── reservations.controller.ts
    └── repositories/
        └── prisma-reservation.repository.ts
```

### Módulo de Spaces

```
spaces/
├── application/
│   ├── dtos/
│   │   ├── create-space.dto.ts
│   │   └── space-response.dto.ts
│   └── use-cases/
│       ├── create-space.use-case.ts          # 🎯 Caso crítico
│       ├── get-all-spaces.use-case.ts
│       ├── get-space-by-id.use-case.ts
│       └── get-available-spaces.use-case.ts
├── domain/
│   ├── entities/
│   │   └── space.entity.ts
│   ├── repositories/
│   │   └── space.repository.interface.ts
│   └── value-objects/
│       └── space-type.value-object.ts
└── infrastructure/
    ├── controllers/
    │   └── spaces.controller.ts
    └── repositories/
        └── prisma-space.repository.ts
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno

Crear archivo `.env` en la raíz del backend:

```env
# Base de datos
DATABASE_URL="file:./dev.db"

# Servidor
PORT=3000
NODE_ENV=development

# JWT (si se implementa autenticación)
JWT_SECRET=your-secret-key

# Email (para notificaciones)
SMTP_HOST=localhost
SMTP_PORT=587
SMTP_USER=test
SMTP_PASS=test
```

### Scripts de Desarrollo

```bash
# Desarrollo con hot reload
npm run start:dev

# Desarrollo con debug
npm run start:debug

# Build de producción
npm run build

# Ejecutar build de producción
npm run start:prod
```

## 🎨 Patrones Implementados

### 1. Repository Pattern
```typescript
// Interfaz en el dominio
export interface SpaceRepository extends BaseRepository<Space, string> {
  findByType(type: string): Promise<Space[]>;
  findAvailableSpaces(date: Date, startTime: Date, endTime: Date): Promise<Space[]>;
}

// Implementación en infraestructura
@Injectable()
export class PrismaSpaceRepository implements SpaceRepository {
  // Implementación concreta con Prisma
}
```

### 2. Use Case Pattern
```typescript
@Injectable()
export class CreateReservationUseCase {
  async execute(dto: CreateReservationDto): Promise<ReservationResponseDto> {
    // 1. Validar usuario
    // 2. Validar espacio  
    // 3. Verificar conflictos
    // 4. Crear reserva
    // 5. Enviar notificación
  }
}
```

### 3. Value Objects
```typescript
export class ReservationStatus extends ValueObject<string> {
  static pending(): ReservationStatus {
    return new ReservationStatus('PENDING');
  }
  
  static confirmed(): ReservationStatus {
    return new ReservationStatus('CONFIRMED');
  }
}
```

### 4. Domain Events (Futuro)
```typescript
// Ejemplo de implementación futura
export class ReservationCreatedEvent extends DomainEvent {
  constructor(public readonly reservation: Reservation) {
    super();
  }
}
```

## 🚀 Despliegue

### Docker (Opcional)

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
COPY prisma ./prisma
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Comandos de Build

```bash
# Compilar TypeScript
npm run build

# Preparar base de datos para producción
npm run db:deploy

# Ejecutar en producción
npm run start:prod
```

## 📈 Monitoreo y Logging

### Health Check
```bash
# Verificar estado del servidor
curl http://localhost:3000/health
```

### Logs Estructurados
- Uso de logger de NestJS
- Contexto en cada log
- Niveles: error, warn, log, debug, verbose

## 🔍 Debugging

### VS Code Configuration
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug NestJS",
  "args": ["${workspaceFolder}/src/main.ts"],
  "runtimeArgs": ["--nolazy", "-r", "ts-node/register", "-r", "tsconfig-paths/register"],
  "sourceMaps": true,
  "envFile": "${workspaceFolder}/.env",
  "cwd": "${workspaceFolder}"
}
```

### Debug Tests
```bash
# Debug específico test
npm run test:debug -- test/unit/reservations/create-reservation.use-case.spec.ts

# Después conectar debugger en puerto 9229
```

## 📚 Recursos Adicionales

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)

---

**Este backend implementa las mejores prácticas de arquitectura de software, siendo fácilmente testeable, mantenible y extensible.**
