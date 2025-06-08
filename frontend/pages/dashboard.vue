<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p class="text-gray-600">
        Bienvenido{{ userStore.currentUser ? `, ${userStore.currentUser.name}` : '' }}
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Mis Reservas</p>
            <p class="text-2xl font-semibold text-gray-900">{{ userReservations.length }}</p>
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
            <p class="text-sm font-medium text-gray-600">Confirmadas</p>
            <p class="text-2xl font-semibold text-gray-900">{{ confirmedReservations }}</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pendientes</p>
            <p class="text-2xl font-semibold text-gray-900">{{ pendingReservations }}</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 11h10v-2H4v2zM4 3h10v2H4V3z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Notificaciones</p>
            <p class="text-2xl font-semibold text-gray-900">{{ unreadNotifications }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <div class="lg:col-span-2">
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NuxtLink
              to="/reservations/new"
              class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
            >
              <div class="text-center">
                <svg class="mx-auto h-8 w-8 text-gray-400 group-hover:text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 group-hover:text-blue-900">Nueva Reserva</h3>
                <p class="text-sm text-gray-600">Reserva un espacio comunitario</p>
              </div>
            </NuxtLink>
            
            <NuxtLink
              to="/spaces"
              class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group"
            >
              <div class="text-center">
                <svg class="mx-auto h-8 w-8 text-gray-400 group-hover:text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 group-hover:text-green-900">Explorar Espacios</h3>
                <p class="text-sm text-gray-600">Ver espacios disponibles</p>
              </div>
            </NuxtLink>
            
            <NuxtLink
              to="/reservations"
              class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors group"
            >
              <div class="text-center">
                <svg class="mx-auto h-8 w-8 text-gray-400 group-hover:text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 group-hover:text-purple-900">Mis Reservas</h3>
                <p class="text-sm text-gray-600">Gestionar reservas actuales</p>
              </div>
            </NuxtLink>
            
            <NuxtLink
              to="/notifications"
              class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors group"
            >
              <div class="text-center">
                <svg class="mx-auto h-8 w-8 text-gray-400 group-hover:text-orange-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 11h10v-2H4v2zM4 3h10v2H4V3z"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 group-hover:text-orange-900">Notificaciones</h3>
                <p class="text-sm text-gray-600">Ver notificaciones recientes</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
        
        <div v-if="recentActivity.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <p class="mt-2 text-gray-600">No hay actividad reciente</p>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="activity in recentActivity.slice(0, 5)"
            :key="activity.id"
            class="flex items-start gap-3"
          >
            <div
              :class="[
                'flex-shrink-0 w-2 h-2 rounded-full mt-2',
                getActivityColor(activity.type)
              ]"
            ></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900">{{ activity.title }}</p>
              <p class="text-xs text-gray-500">{{ getRelativeTime(activity.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Reservations -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Próximas Reservas</h2>
          <NuxtLink to="/reservations" class="text-sm text-blue-600 hover:text-blue-800">
            Ver todas
          </NuxtLink>
        </div>
        
        <div v-if="upcomingReservations.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <p class="mt-2 text-gray-600">No tienes reservas próximas</p>
          <NuxtLink to="/reservations/new" class="btn-primary mt-4 inline-flex items-center">
            Crear nueva reserva
          </NuxtLink>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="reservation in upcomingReservations.slice(0, 3)"
            :key="reservation.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-medium text-gray-900">
                {{ reservation.space?.name || 'Espacio no encontrado' }}
              </h3>
              <span
                :class="getStatusBadgeClass(reservation.status)"
                class="badge"
              >
                {{ getStatusText(reservation.status) }}
              </span>
            </div>
            
            <p class="text-sm text-gray-600 mb-2">{{ reservation.purpose }}</p>
            
            <div class="flex items-center text-sm text-gray-500">
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              {{ formatDateTime(reservation.startTime) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Spaces -->
      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Espacios Populares</h2>
          <NuxtLink to="/spaces" class="text-sm text-blue-600 hover:text-blue-800">
            Ver todos
          </NuxtLink>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="space in popularSpaces.slice(0, 3)"
            :key="space.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-medium text-gray-900">{{ space.name }}</h3>
              <span
                :class="[
                  'badge',
                  space.available ? 'badge-success' : 'badge-error'
                ]"
              >
                {{ space.available ? 'Disponible' : 'No disponible' }}
              </span>
            </div>
            
            <p class="text-sm text-gray-600 mb-2">{{ space.description }}</p>
            
            <div class="flex items-center justify-between text-sm text-gray-500">
              <span>Capacidad: {{ space.capacity }} personas</span>
              <NuxtLink
                :to="`/spaces/${space.id}`"
                class="text-blue-600 hover:text-blue-800"
              >
                Ver detalles
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { useReservationStore } from '~/stores/reservation'
import { useSpaceStore } from '~/stores/space'
import { useNotificationStore } from '~/stores/notification'
import type { ReservationStatus } from '~/types'

// Meta
definePageMeta({
  title: 'Dashboard'
})

// Stores
const userStore = useUserStore()
const reservationStore = useReservationStore()
const spaceStore = useSpaceStore()
const notificationStore = useNotificationStore()

// Reactive data
const loading = ref(true)

// Computed
const userReservations = computed(() => reservationStore.reservations)

const confirmedReservations = computed(() =>
  userReservations.value.filter(r => r.status === 'CONFIRMED').length
)

const pendingReservations = computed(() =>
  userReservations.value.filter(r => r.status === 'PENDING').length
)

const unreadNotifications = computed(() =>
  notificationStore.notifications.filter(n => !n.read).length
)

const upcomingReservations = computed(() => {
  const now = new Date()
  return userReservations.value
    .filter(r => new Date(r.startTime) > now && r.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
})

const popularSpaces = computed(() => {
  return spaceStore.spaces
    .filter(s => s.available)
    .sort((a, b) => (b.capacity || 0) - (a.capacity || 0))
})

const recentActivity = computed(() => {
  const activities: any[] = []
  
  // Add recent reservations as activities
  userReservations.value.slice(0, 5).forEach(reservation => {
    activities.push({
      id: `reservation-${reservation.id}`,
      type: 'reservation',
      title: `Reserva creada: ${reservation.space?.name}`,
      createdAt: reservation.createdAt
    })
  })
  
  // Add recent notifications as activities
  notificationStore.notifications.slice(0, 5).forEach(notification => {
    activities.push({
      id: `notification-${notification.id}`,
      type: 'notification',
      title: notification.title,
      createdAt: notification.createdAt
    })
  })
  
  return activities
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)
})

// Methods
function getStatusBadgeClass(status: ReservationStatus): string {
  const classes = {
    PENDING: 'badge-warning',
    CONFIRMED: 'badge-success',
    CANCELLED: 'badge-error',
    COMPLETED: 'badge-info'
  }
  return classes[status] || 'badge-secondary'
}

function getStatusText(status: ReservationStatus): string {
  const texts = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmada',
    CANCELLED: 'Cancelada',
    COMPLETED: 'Completada'
  }
  return texts[status] || status
}

function getActivityColor(type: string): string {
  const colors: Record<string, string> = {
    reservation: 'bg-blue-500',
    notification: 'bg-green-500',
    space: 'bg-purple-500'
  }
  return colors[type] || 'bg-gray-500'
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `Hace ${days}d`
  }
}

// Lifecycle
onMounted(async () => {
  if (!userStore.currentUser) {
    // Redirect to login if no user
    await navigateTo('/auth/login')
    return
  }

  loading.value = true
  try {
    // Load all necessary data
    await Promise.all([
      reservationStore.fetchUserReservations(userStore.currentUser.id),
      spaceStore.fetchSpaces(),
      notificationStore.fetchNotifications(userStore.currentUser.id)
    ])
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
})
</script>
