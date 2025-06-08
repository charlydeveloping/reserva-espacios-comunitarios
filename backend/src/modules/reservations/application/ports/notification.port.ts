/**
 * Puerto para el servicio de notificaciones
 * Define la interfaz para enviar notificaciones sin depender de la implementación
 */
export interface NotificationPort {
  sendReservationConfirmation(userEmail: string, reservationDetails: ReservationNotificationData): Promise<void>;
  sendReservationCancellation(userEmail: string, reservationDetails: ReservationNotificationData): Promise<void>;
  sendReservationReminder(userEmail: string, reservationDetails: ReservationNotificationData): Promise<void>;
}

export interface ReservationNotificationData {
  reservationId: string;
  userName: string;
  spaceName: string;
  date: string;
  startTime: string;
  endTime: string;
}
