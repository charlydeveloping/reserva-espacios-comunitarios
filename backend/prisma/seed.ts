import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding de la base de datos...');

  // Limpiar datos existentes (en orden para evitar conflictos de claves foráneas)
  await prisma.notification.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.space.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios de prueba
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        nombre: 'Carlos Ramirez',
        email: 'carlos.ramirez.g@ucb.edu.bo',
      },
    }),
    prisma.user.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440002',
        nombre: 'Ana García',
        email: 'ana.garcia@email.com',
      },
    }),
    prisma.user.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440003',
        nombre: 'Carlos López',
        email: 'carlos.lopez@email.com',
      },
    }),
    prisma.user.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440004',
        nombre: 'María Rodríguez',
        email: 'maria.rodriguez@email.com',
      },
    }),
    prisma.user.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440005',
        nombre: 'Jorge Martín',
        email: 'jorge.martin@email.com',
      },
    }),
  ]);

  console.log(`✅ Creados ${users.length} usuarios`);

  // Crear espacios de prueba
  const spaces = await Promise.all([
    prisma.space.create({
      data: {
        id: '660e8400-e29b-41d4-a716-446655440001',
        nombre: 'Sala de Reuniones Principal',
        tipo: 'sala_reunion',
        capacidad: 20,
      },
    }),
    prisma.space.create({
      data: {
        id: '660e8400-e29b-41d4-a716-446655440002',
        nombre: 'Auditorio Central',
        tipo: 'auditorio',
        capacidad: 150,
      },
    }),
    prisma.space.create({
      data: {
        id: '660e8400-e29b-41d4-a716-446655440003',
        nombre: 'Cancha de Fútbol',
        tipo: 'cancha_deportiva',
        capacidad: 22,
      },
    }),
    prisma.space.create({
      data: {
        id: '660e8400-e29b-41d4-a716-446655440004',
        nombre: 'Salón de Eventos',
        tipo: 'salon_eventos',
        capacidad: 100,
      },
    }),
    prisma.space.create({
      data: {
        id: '660e8400-e29b-41d4-a716-446655440005',
        nombre: 'Laboratorio de Informática',
        tipo: 'laboratorio',
        capacidad: 30,
      },
    }),
    prisma.space.create({
      data: {
        id: '660e8400-e29b-41d4-a716-446655440006',
        nombre: 'Biblioteca Comunitaria',
        tipo: 'biblioteca',
        capacidad: 50,
      },
    }),
  ]);

  console.log(`✅ Creados ${spaces.length} espacios`);

  // Crear reservas de prueba
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(0, 0, 0, 0);

  const reservations = await Promise.all([
    prisma.reservation.create({
      data: {
        id: '770e8400-e29b-41d4-a716-446655440001',
        usuarioId: users[0].id,
        espacioId: spaces[0].id,
        fecha: tomorrow,
        horaInicio: new Date(tomorrow.getTime() + 9 * 60 * 60 * 1000), // 9:00 AM
        horaFin: new Date(tomorrow.getTime() + 11 * 60 * 60 * 1000), // 11:00 AM
        estado: 'CONFIRMED',
      },
    }),
    prisma.reservation.create({
      data: {
        id: '770e8400-e29b-41d4-a716-446655440002',
        usuarioId: users[1].id,
        espacioId: spaces[1].id,
        fecha: tomorrow,
        horaInicio: new Date(tomorrow.getTime() + 14 * 60 * 60 * 1000), // 2:00 PM
        horaFin: new Date(tomorrow.getTime() + 16 * 60 * 60 * 1000), // 4:00 PM
        estado: 'PENDING',
      },
    }),
    prisma.reservation.create({
      data: {
        id: '770e8400-e29b-41d4-a716-446655440003',
        usuarioId: users[2].id,
        espacioId: spaces[2].id,
        fecha: nextWeek,
        horaInicio: new Date(nextWeek.getTime() + 16 * 60 * 60 * 1000), // 4:00 PM
        horaFin: new Date(nextWeek.getTime() + 18 * 60 * 60 * 1000), // 6:00 PM
        estado: 'CONFIRMED',
      },
    }),
  ]);

  console.log(`✅ Creadas ${reservations.length} reservas`);

  // Crear notificaciones de prueba
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        id: '880e8400-e29b-41d4-a716-446655440001',
        userId: users[0].id,
        type: 'RESERVATION_CONFIRMATION',
        subject: 'Confirmación de Reserva - Sala de Reuniones',
        content: 'Su reserva para la Sala de Reuniones Principal ha sido confirmada para mañana de 9:00 a 11:00.',
        status: 'SENT',
        sentAt: new Date(),
      },
    }),
    prisma.notification.create({
      data: {
        id: '880e8400-e29b-41d4-a716-446655440002',
        userId: users[1].id,
        type: 'RESERVATION_CONFIRMATION',
        subject: 'Reserva Pendiente - Auditorio Central',
        content: 'Su reserva para el Auditorio Central está pendiente de confirmación para mañana de 14:00 a 16:00.',
        status: 'PENDING',
      },
    }),
    prisma.notification.create({
      data: {
        id: '880e8400-e29b-41d4-a716-446655440003',
        userId: users[2].id,
        type: 'RESERVATION_REMINDER',
        subject: 'Recordatorio - Cancha de Fútbol',
        content: 'Le recordamos su reserva para la Cancha de Fútbol la próxima semana de 16:00 a 18:00.',
        status: 'PENDING',
      },
    }),
  ]);

  console.log(`✅ Creadas ${notifications.length} notificaciones`);

  console.log('🎉 Seeding completado exitosamente!');
  console.log('\n📊 Datos creados:');
  console.log(`   - ${users.length} usuarios`);
  console.log(`   - ${spaces.length} espacios`);
  console.log(`   - ${reservations.length} reservas`);
  console.log(`   - ${notifications.length} notificaciones`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
