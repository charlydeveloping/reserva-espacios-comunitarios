import { defineStore } from 'pinia'
import { useNotifications } from '~/composables/useNotifications'
import type { Notification } from '~/types'

export const useNotificationStore = defineStore('notification', () => {
  // Composables
  const { 
    fetchNotifications: apiFetchNotifications,
    getUserNotifications: apiFetchUserNotifications,
    markAsRead: apiMarkAsRead,
    markAllAsRead: apiMarkAllAsRead
  } = useNotifications()

  // State
  const notifications = ref<Notification[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const unreadNotifications = computed(() => 
    notifications.value.filter(notification => !notification.read)
  )

  const unreadCount = computed(() => unreadNotifications.value.length)

  const recentNotifications = computed(() => 
    notifications.value
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
  )

  // Actions
  async function fetchNotifications(userId?: string) {
    loading.value = true
    error.value = null

    try {
      const { data } = userId 
        ? await apiFetchUserNotifications(userId)
        : await apiFetchNotifications()
      
      if (data.value) {
        notifications.value = data.value
        return data.value
      }
      return []
    } catch (err: any) {
      error.value = err.message || 'Error al cargar notificaciones'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function markAsRead(notificationId: string) {
    try {
      await apiMarkAsRead(notificationId)
      
      // Update local state
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
        notification.readAt = new Date().toISOString()
      }
    } catch (err: any) {
      error.value = err.message || 'Error al marcar notificación como leída'
      throw err
    }
  }

  async function markAllAsRead() {
    try {
      await apiMarkAllAsRead()
      
      // Update local state
      const now = new Date().toISOString()
      notifications.value.forEach(notification => {
        if (!notification.read) {
          notification.read = true
          notification.readAt = now
        }
      })
    } catch (err: any) {
      error.value = err.message || 'Error al marcar todas las notificaciones como leídas'
      throw err
    }
  }

  function addNotification(notification: Notification) {
    notifications.value.unshift(notification)
  }

  function removeNotification(notificationId: string) {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clearAll() {
    notifications.value = []
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    notifications: readonly(notifications),
    loading: readonly(loading),
    error: readonly(error),

    // Getters
    unreadNotifications,
    unreadCount,
    recentNotifications,

    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearAll,
    clearError
  }
})
