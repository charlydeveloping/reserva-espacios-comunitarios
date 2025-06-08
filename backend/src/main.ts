import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración global de validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de CORS
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'], // Frontend URLs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Reserva Espacios Comunitarios API')
    .setDescription('API para sistema de reservas de espacios comunitarios con arquitectura hexagonal')
    .setVersion('1.0')
    .addTag('usuarios', 'Operaciones relacionadas con usuarios')
    .addTag('espacios', 'Operaciones relacionadas con espacios')
    .addTag('reservas', 'Operaciones relacionadas con reservas')
    .addTag('notificaciones', 'Operaciones relacionadas con notificaciones')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Aplicación ejecutándose en: http://localhost:${port}`);
  console.log(`📚 Documentación API: http://localhost:${port}/api/docs`);
}

bootstrap();
