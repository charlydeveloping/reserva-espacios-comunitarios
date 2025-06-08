<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Notificaciones</h1>
        <p class="text-gray-600">Mantente al día con las actualizaciones de tus reservas</p>
      </div>
      
      <div class="flex gap-2 mt-4 lg:mt-0">
        <button
          @click="markAllAsRead"
          :disabled="unreadCount === 0"
          class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Marcar todas como leídas
        </button>
        
        <button
          @click="refreshNotifications"
          class="btn-primary"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Actualizar
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 11h10v-2H4v2zM4 3h10v2H4V3z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total</p>
            <p class="text-2xl font-semibold text-gray-900">{{ notificationStore.notifications.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">No leídas</p>
            <p class="text-2xl font-semibold text-gray-900">{{ unreadCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Leídas</p>
            <p class="text-2xl font-semibold text-gray-900">{{ readCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            v-model="selectedRead"
            class="form-input"
          >
            <option value="">Todas</option>
            <option value="false">No leídas</option>
            <option value="true">Leídas</option>
          </select>
        </div>
        
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            v-model="selectedType"
            class="form-input"
          >
            <option value="">Todos los tipos</option>
            <option value="RESERVATION_CONFIRMED">Reserva confirmada</option>
            <option value="RESERVATION_CANCELLED">Reserva cancelada</option>
            <option value="RESERVATION_REMINDER">Recordatorio</option>
            <option value="SYSTEM">Sistema</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Notifications List -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Cargando notificaciones...</p>
    </div>

    <div v-else-if="filteredNotifications.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 11h10v-2H4v2zM4 3h10v2H4V3z"/>
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No hay notificaciones</h3>
      <p class="mt-2 text-gray-500">Cuando tengas nuevas notificaciones aparecerán aquí.</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="notification in filteredNotifications"
        :key="notification.id"
        :class="[
          'card cursor-pointer transition-all duration-200',
          !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : '',
          'hover:shadow-lg'
        ]"
        @click="markAsRead(notification.id)"
      >
        <div class="flex items-start gap-4">
          <!-- Icon -->
          <div
            :class="[
              'flex-shrink-0 p-2 rounded-lg',
              getNotificationIconClass(notification.type)
            ]"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="getNotificationIconPath(notification.type)"
              />
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3
                  :class="[
                    'text-sm font-medium',
                    notification.read ? 'text-gray-900' : 'text-gray-900 font-semibold'
                  ]"
                >
                  {{ notification.title }}
                </h3>
                <p
                  :class="[
                    'mt-1 text-sm',
                    notification.read ? 'text-gray-600' : 'text-gray-700'
                  ]"
                >
                  {{ notification.message }}
                </p>
                
                <!-- Related Reservation Link -->
                <div v-if="notification.reservationId" class="mt-2">
                  <NuxtLink
                    :to="`/reservations/${notification.reservationId}`"
                    class="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    @click.stop
                  >
                    Ver reserva relacionada →
                  </NuxtLink>
                </div>
              </div>

              <!-- Timestamp and Read Status -->
              <div class="flex flex-col items-end gap-1 ml-4">
                <span class="text-xs text-gray-500">
                  {{ getRelativeTime(notification.createdAt) }}
                </span>
                
                <div
                  v-if="!notification.read"
                  class="w-2 h-2 bg-blue-500 rounded-full"
                  title="No leída"
                ></div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex-shrink-0">
            <button
              v-if="!notification.read"
              @click.stop="markAsRead(notification.id)"
              class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Marcar como leída"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Load More -->
    <div v-if="hasMore && !loading" class="text-center mt-8">
      <button
        @click="loadMore"
        class="btn-secondary"
      >
        Cargar más notificaciones
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '~/stores/notification'
import { useUserStore } from '~/stores/user'
import type { NotificationType } from '~/types'

// Meta
definePageMeta({
  title: 'Notificaciones'
})

// Stores
const notificationStore = useNotificationStore()
const userStore = useUserStore()

// Reactive data
const loading = ref(false)
const selectedRead = ref('')
const selectedType = ref('')
const hasMore = ref(true)

// Computed
const unreadCount = computed(() => 
  notificationStore.notifications.filter(n => !n.read).length
)

const readCount = computed(() => 
  notificationStore.notifications.filter(n => n.read).length
)

const filteredNotifications = computed(() => {
  let filtered = [...notificationStore.notifications]

  if (selectedRead.value !== '') {
    const isRead = selectedRead.value === 'true'
    filtered = filtered.filter(n => n.read === isRead)
  }

  if (selectedType.value) {
    filtered = filtered.filter(n => n.type === selectedType.value)
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

// Methods
function getNotificationIconClass(type: NotificationType): string {
  const classes = {
    RESERVATION_CONFIRMED: 'bg-green-100 text-green-600',
    RESERVATION_CANCELLED: 'bg-red-100 text-red-600',
    RESERVATION_REMINDER: 'bg-yellow-100 text-yellow-600',
    SYSTEM: 'bg-blue-100 text-blue-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

function getNotificationIconPath(type: NotificationType): string {
  const paths = {
    RESERVATION_CONFIRMED: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    RESERVATION_CANCELLED: 'M6 18L18 6M6 6l12 12',
    RESERVATION_REMINDER: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    SYSTEM: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
  return paths[type] || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Hace un momento'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `Hace ${minutes} min`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `Hace ${hours}h`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `Hace ${days}d`
  } else {
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    })
  }
}

async function markAsRead(id: string) {
  try {
    await notificationStore.markAsRead(id)
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

async function markAllAsRead() {
  if (!confirm('¿Marcar todas las notificaciones como leídas?')) {
    return
  }

  try {
    await notificationStore.markAllAsRead()
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
  }
}

async function refreshNotifications() {
  if (!userStore.currentUser) return

  loading.value = true
  try {
    await notificationStore.fetchNotifications(userStore.currentUser.id)
  } catch (error) {
    console.error('Error refreshing notifications:', error)
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  // Placeholder for pagination
  console.log('Load more notifications...')
}

// Lifecycle
onMounted(async () => {
  if (!userStore.currentUser) return

  loading.value = true
  try {
    await notificationStore.fetchNotifications(userStore.currentUser.id)
  } catch (error) {
    console.error('Error loading notifications:', error)
  } finally {
    loading.value = false
  }
})
</script>
