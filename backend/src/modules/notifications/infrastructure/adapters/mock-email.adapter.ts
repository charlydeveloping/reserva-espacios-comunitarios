import { Injectable } from '@nestjs/common';
import { NotificationPort, ReservationNotificationData } from '../../../reservations/application/ports/notification.port';

/**
 * Adaptador mock para el servicio de email
 * En un entorno real, esto se conectaría a un servicio de email como SendGrid, AWS SES, etc.
 */
@Injectable()
export class MockEmailAdapter implements NotificationPort {
  async sendReservationConfirmation(
    userEmail: string,
    reservationDetails: ReservationNotificationData,
  ): Promise<void> {
    console.log('🚀 ENVIANDO EMAIL DE CONFIRMACIÓN DE RESERVA (MOCK)');
    console.log('📧 Destinatario:', userEmail);
    console.log('📋 Detalles de la reserva:');
    console.log(`   - ID: ${reservationDetails.reservationId}`);
    console.log(`   - Usuario: ${reservationDetails.userName}`);
    console.log(`   - Espacio: ${reservationDetails.spaceName}`);
    console.log(`   - Fecha: ${reservationDetails.date}`);
    console.log(`   - Horario: ${reservationDetails.startTime} - ${reservationDetails.endTime}`);
    console.log('✅ Email enviado exitosamente (simulado)\n');

    // Simular latencia de red
    await this.simulateNetworkDelay();
  }

  async sendReservationCancellation(
    userEmail: string,
    reservationDetails: ReservationNotificationData,
  ): Promise<void> {
    console.log('❌ ENVIANDO EMAIL DE CANCELACIÓN DE RESERVA (MOCK)');
    console.log('📧 Destinatario:', userEmail);
    console.log('📋 Detalles de la reserva cancelada:');
    console.log(`   - ID: ${reservationDetails.reservationId}`);
    console.log(`   - Usuario: ${reservationDetails.userName}`);
    console.log(`   - Espacio: ${reservationDetails.spaceName}`);
    console.log(`   - Fecha: ${reservationDetails.date}`);
    console.log(`   - Horario: ${reservationDetails.startTime} - ${reservationDetails.endTime}`);
    console.log('✅ Email de cancelación enviado exitosamente (simulado)\n');

    // Simular latencia de red
    await this.simulateNetworkDelay();
  }

  async sendReservationReminder(
    userEmail: string,
    reservationDetails: ReservationNotificationData,
  ): Promise<void> {
    console.log('⏰ ENVIANDO EMAIL DE RECORDATORIO DE RESERVA (MOCK)');
    console.log('📧 Destinatario:', userEmail);
    console.log('📋 Recordatorio de reserva:');
    console.log(`   - ID: ${reservationDetails.reservationId}`);
    console.log(`   - Usuario: ${reservationDetails.userName}`);
    console.log(`   - Espacio: ${reservationDetails.spaceName}`);
    console.log(`   - Fecha: ${reservationDetails.date}`);
    console.log(`   - Horario: ${reservationDetails.startTime} - ${reservationDetails.endTime}`);
    console.log('✅ Email de recordatorio enviado exitosamente (simulado)\n');

    // Simular latencia de red
    await this.simulateNetworkDelay();
  }

  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.random() * 1000 + 500; // 500-1500ms
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Método adicional para probar diferentes escenarios de error
   */
  async sendTestNotification(
    userEmail: string,
    subject: string,
    content: string,
    shouldFail = false,
  ): Promise<void> {
    if (shouldFail) {
      console.log('💥 SIMULANDO FALLO EN ENVÍO DE EMAIL');
      throw new Error('Error simulado en el servicio de email');
    }

    console.log('📧 ENVIANDO NOTIFICACIÓN DE PRUEBA (MOCK)');
    console.log('Destinatario:', userEmail);
    console.log('Asunto:', subject);
    console.log('Contenido:', content);
    console.log('✅ Notificación enviada exitosamente (simulado)');

    await this.simulateNetworkDelay();
  }
}
