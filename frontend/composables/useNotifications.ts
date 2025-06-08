import type { Notification, CreateNotificationDto, NotificationType, NotificationStatus } from '~/types'

export const useNotifications = () => {
  const { get, post } = useApi()

  // Get all notifications
  const getNotifications = () => {
    return get<Notification[]>('/notifications')
  }

  // Get notifications by user ID
  const getUserNotifications = (userId: string) => {
    return get<Notification[]>(`/notifications/user/${userId}`)
  }

  // Create notification
  const createNotification = async (notificationData: CreateNotificationDto): Promise<Notification> => {
    return post<Notification>('/notifications', notificationData)
  }

  // Fetch notifications (alias for getNotifications for consistency)
  const fetchNotifications = () => {
    return getNotifications()
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string): Promise<Notification> => {
    const { put } = useApi()
    return put<Notification>(`/notifications/${notificationId}/read`, {})
  }

  // Mark all notifications as read
  const markAllAsRead = async (): Promise<void> => {
    const { put } = useApi()
    return put<void>('/notifications/mark-all-read', {})
  }

  // Get notification type options
  const getNotificationTypeOptions = (): { value: NotificationType; label: string; icon: string }[] => {
    return [
      { 
        value: 'RESERVATION_CONFIRMED', 
        label: 'Confirmación de Reserva', 
        icon: '✅' 
      },
      { 
        value: 'RESERVATION_CANCELLED', 
        label: 'Cancelación de Reserva', 
        icon: '❌' 
      },
      { 
        value: 'RESERVATION_REMINDER', 
        label: 'Recordatorio de Reserva', 
        icon: '⏰' 
      },
      { 
        value: 'SYSTEM', 
        label: 'Sistema', 
        icon: '🔧' 
      },
    ]
  }

  // Get notification status options
  const getNotificationStatusOptions = (): { value: NotificationStatus; label: string; color: string }[] => {
    return [
      { value: 'PENDING', label: 'Pendiente', color: 'warning' },
      { value: 'SENT', label: 'Enviada', color: 'success' },
      { value: 'FAILED', label: 'Fallida', color: 'error' },
    ]
  }

  // Get notification type info
  const getNotificationTypeInfo = (type: NotificationType) => {
    const options = getNotificationTypeOptions()
    return options.find(option => option.value === type) || { 
      value: type, 
      label: type, 
      icon: '📧' 
    }
  }

  // Get notification status info
  const getNotificationStatusInfo = (status: NotificationStatus) => {
    const options = getNotificationStatusOptions()
    return options.find(option => option.value === status) || { 
      value: status, 
      label: status, 
      color: 'info' 
    }
  }

  // Format notification date
  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    const diffInDays = diffInHours / 24

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return `hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `hace ${hours} hora${hours !== 1 ? 's' : ''}`
    } else if (diffInDays < 7) {
      const days = Math.floor(diffInDays)
      return `hace ${days} día${days !== 1 ? 's' : ''}`
    } else {
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }

  return {
    getNotifications,
    getUserNotifications,
    createNotification,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    getNotificationTypeOptions,
    getNotificationStatusOptions,
    getNotificationTypeInfo,
    getNotificationStatusInfo,
    formatNotificationDate,
  }
}
