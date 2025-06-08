# 🏢 Sistema de Reserva de Espacios Comunitarios

Sistema completo para la gestión y reserva de espacios comunitarios, desarrollado con **arquitectura hexagonal** y las mejores prácticas de desarrollo de software.

## 📋 Descripción del Proyecto

Este proyecto es un trabajo académico para la materia de **Arquitectura de Software** que implementa un sistema de reservas de espacios comunitarios siguiendo los principios de:

- 🏗️ **Arquitectura Hexagonal (Ports & Adapters)**
- 🎯 **Domain-Driven Design (DDD)**
- 🧪 **Test-Driven Development (TDD)**
- 🔄 **Clean Architecture**

## 🏗️ Arquitectura

El proyecto está construido con:

### Backend
- **Framework**: NestJS + TypeScript
- **Base de datos**: SQLite con Prisma ORM
- **Arquitectura**: Hexagonal (Ports & Adapters)
- **Testing**: Jest para pruebas unitarias e integración
- **Documentación API**: Swagger/OpenAPI

### Frontend
- **Framework**: Nuxt.js 3 + Vue.js 3
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **TypeScript**: Soporte completo

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Git

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd reserva-espacios-comunitarios
```

### 2. Configurar el Backend

```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias
npm install

# Configurar la base de datos
npm run db:generate    # Generar cliente Prisma
npm run db:migrate     # Ejecutar migraciones
npm run db:seed        # Poblar con datos de prueba
```

### 3. Configurar el Frontend

```bash
# Navegar al directorio del frontend (desde la raíz)
cd frontend

# Instalar dependencias
npm install
```

## 🏃‍♂️ Ejecutar el Proyecto

### Levantar el Backend

```bash
cd backend

# Modo desarrollo (con hot reload)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

El backend estará disponible en: `http://localhost:3000`
- API: `http://localhost:3000/api`
- Documentación Swagger: `http://localhost:3000/api/docs`

### Levantar el Frontend

```bash
cd frontend

# Modo desarrollo
npm run dev

# Modo producción
npm run build
npm run preview
```

El frontend estará disponible en: `http://localhost:3001`

## 🧪 Ejecutar Tests

### Tests del Backend

```bash
cd backend

# Ejecutar todos los tests
npm test

# Tests en modo watch (recomendado para desarrollo)
npm run test:watch

# Tests con cobertura de código
npm run test:cov

# Tests de integración (end-to-end)
npm run test:e2e
```

### Tests Específicos

```bash
# Test del caso de uso crítico CreateReservationUseCase
npm test -- test/unit/reservations/create-reservation.use-case.spec.ts

# Test del caso de uso CreateSpaceUseCase
npm test -- src/modules/spaces/application/use-cases/create-space.use-case.spec.ts

# Test de una entidad específica
npm test -- test/unit/users/create-user.use-case.spec.ts
```

### Ejecutar Tests con Filtros

```bash
# Tests que contengan "CreateReservation" en el nombre
npm test -- --testNamePattern="CreateReservation"

# Tests de un módulo específico
npm test -- --testPathPattern="reservations"

# Tests en modo debug
npm run test:debug
```

## 📊 Base de Datos

### Comandos Útiles de Prisma

```bash
cd backend

# Ver datos en Prisma Studio
npm run db:studio

# Resetear base de datos (⚠️ Elimina todos los datos)
npm run db:reset

# Aplicar migraciones en producción
npm run db:deploy

# Generar nueva migración después de cambios en schema
npm run db:migrate
```

### Estructura de la Base de Datos

- **users**: Usuarios del sistema
- **spaces**: Espacios comunitarios disponibles
- **reservations**: Reservas realizadas
- **notifications**: Notificaciones del sistema

## 🏛️ Estructura del Proyecto

### Backend (Arquitectura Hexagonal)

```
src/
├── modules/                    # Módulos de dominio
│   ├── users/                 # Gestión de usuarios
│   ├── spaces/                # Gestión de espacios
│   ├── reservations/          # Gestión de reservas (núcleo del negocio)
│   └── notifications/         # Sistema de notificaciones
├── shared/                    # Código compartido
│   ├── domain/               # Entidades base, excepciones, value objects
│   ├── application/          # Servicios de aplicación compartidos
│   └── infrastructure/       # Infraestructura compartida
└── config/                   # Configuración de la aplicación
```

### Cada Módulo Sigue la Estructura:

```
module/
├── application/              # Capa de aplicación
│   ├── dtos/                # Data Transfer Objects
│   ├── use-cases/           # Casos de uso (lógica de aplicación)
│   └── ports/               # Interfaces para servicios externos
├── domain/                  # Capa de dominio (reglas de negocio)
│   ├── entities/            # Entidades del dominio
│   ├── repositories/        # Interfaces de repositorios
│   └── value-objects/       # Objetos de valor
└── infrastructure/          # Capa de infraestructura
    ├── controllers/         # Controladores REST
    ├── repositories/        # Implementaciones de repositorios
    └── adapters/           # Adaptadores para servicios externos
```

## 🧪 Casos de Uso Críticos Testeados

### 1. CreateReservationUseCase
**Archivo**: `test/unit/reservations/create-reservation.use-case.spec.ts`

```bash
npm test -- test/unit/reservations/create-reservation.use-case.spec.ts
```

**Pruebas incluidas**:
- ✅ Crear reserva con datos válidos
- ✅ Validar que el usuario existe
- ✅ Validar que el espacio existe
- ✅ Detectar conflictos de horario
- ✅ Manejar errores de notificación

### 2. CreateSpaceUseCase
**Archivo**: `src/modules/spaces/application/use-cases/create-space.use-case.spec.ts`

```bash
npm test -- src/modules/spaces/application/use-cases/create-space.use-case.spec.ts
```

**Pruebas incluidas**:
- ✅ Crear espacio con datos válidos
- ✅ Validar construcción correcta de entidades
- ✅ Propagar errores del repositorio
- ✅ Soportar diferentes tipos de espacios
- ✅ Generar IDs únicos

### 3. CreateUserUseCase
**Archivo**: `test/unit/users/create-user.use-case.spec.ts`

```bash
npm test -- test/unit/users/create-user.use-case.spec.ts
```

## 🎯 Funcionalidades Principales

### Usuarios
- Registro y gestión de usuarios
- Validación de emails únicos
- Perfiles de usuario

### Espacios
- Gestión de espacios comunitarios
- Diferentes tipos: salas de reunión, auditorios, laboratorios, etc.
- Control de capacidad y disponibilidad

### Reservas (Núcleo del Sistema)
- Creación de reservas con validaciones de negocio
- Detección automática de conflictos de horario
- Estados de reserva: PENDING, CONFIRMED, CANCELLED, COMPLETED
- Sistema de notificaciones

### Notificaciones
- Confirmación de reservas
- Recordatorios
- Cancelaciones

## 🔧 Scripts Útiles

### Backend

```bash
# Desarrollo
npm run start:dev          # Servidor con hot reload
npm run start:debug        # Servidor en modo debug

# Base de datos
npm run db:generate        # Generar cliente Prisma
npm run db:migrate         # Aplicar migraciones
npm run db:seed           # Poblar con datos de prueba
npm run db:studio         # Abrir Prisma Studio
npm run db:reset          # Resetear base de datos

# Testing
npm test                  # Todos los tests
npm run test:watch        # Tests en modo watch
npm run test:cov          # Tests con cobertura
npm run test:e2e          # Tests de integración

# Producción
npm run build             # Compilar TypeScript
npm run start:prod        # Ejecutar en producción
```

### Frontend

```bash
# Desarrollo
npm run dev               # Servidor de desarrollo
npm run build             # Compilar para producción
npm run preview           # Preview de build de producción

# Análisis
npm run analyze           # Analizar bundle
```

## 🔍 Debugging

### Backend
- Debug mode: `npm run start:debug`
- Puerto debug: `9229`
- Logs estructurados con contexto

### Tests
- Debug tests: `npm run test:debug`
- VS Code: Usar configuración de debug incluida

## 📚 Documentación Adicional

- **API Documentation**: `http://localhost:3000/api/docs` (Swagger)
- **Database Schema**: Ver `backend/prisma/schema.prisma`
- **Architecture Decision Records**: En `docs/adr/` (si existe)

## 🤝 Contribuir

1. Fork del proyecto
2. Crear feature branch: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push al branch: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📝 Notas Importantes

- **Arquitectura Hexagonal**: Facilita testing y mantenimiento
- **Domain-Driven Design**: Lógica de negocio en el dominio
- **Testing First**: Tests unitarios para casos de uso críticos
- **Type Safety**: TypeScript en todo el stack
- **API First**: Documentación automática con Swagger

## 🔧 Troubleshooting

### Problemas Comunes

1. **Error de migración de Prisma**:
   ```bash
   npm run db:reset
   npm run db:seed
   ```

2. **Puerto ocupado**:
   ```bash
   # Cambiar puerto en package.json o matar proceso
   lsof -ti:3000 | xargs kill -9
   ```

3. **Dependencias desactualizadas**:
   ```bash
   npm install
   npm audit fix
   ```

4. **Tests fallando**:
   ```bash
   # Limpiar cache de Jest
   npm test -- --clearCache
   ```

---

**Desarrollado para Arquitectura de Software** - Implementación de patrones arquitectónicos modernos y mejores prácticas de desarrollo.
