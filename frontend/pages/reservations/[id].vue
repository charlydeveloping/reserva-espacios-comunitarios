<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Cargando reserva...</p>
    </div>

    <div v-else-if="!reservation" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">Reserva no encontrada</h3>
      <p class="mt-2 text-gray-500">La reserva que buscas no existe o no tienes permisos para verla.</p>
      <NuxtLink to="/reservations" class="btn-primary mt-4 inline-flex items-center">
        Volver a mis reservas
      </NuxtLink>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8">
        <div>
          <nav class="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <NuxtLink to="/reservations" class="hover:text-gray-700">Mis Reservas</NuxtLink>
            <span>/</span>
            <span class="text-gray-900">Reserva #{{ reservation.id.slice(-8).toUpperCase() }}</span>
          </nav>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ reservation.space?.name }}</h1>
          <div class="flex items-center gap-3">
            <span
              :class="getStatusBadgeClass(reservation.status)"
              class="badge"
            >
              {{ getStatusText(reservation.status) }}
            </span>
            <span class="text-gray-600">
              Creada el {{ formatDate(reservation.createdAt) }}
            </span>
          </div>
        </div>

        <div class="flex gap-2 mt-4 lg:mt-0">
          <button
            v-if="canModify"
            @click="showEditModal = true"
            class="btn-secondary"
          >
            Editar
          </button>
          
          <button
            v-if="canCancel"
            @click="cancelReservation"
            class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Cancelar Reserva
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Reservation Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Event Info -->
          <div class="card">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Detalles del Evento</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-2">Fecha y Hora</h3>
                <div class="space-y-2">
                  <div class="flex items-center text-gray-900">
                    <svg class="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    {{ formatDate(reservation.startTime) }}
                  </div>
                  <div class="flex items-center text-gray-900">
                    <svg class="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {{ formatTime(reservation.startTime) }} - {{ formatTime(reservation.endTime) }}
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-2">Asistentes</h3>
                <div class="flex items-center text-gray-900">
                  <svg class="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  {{ reservation.attendees }} persona(s)
                </div>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Propósito</h3>
              <p class="text-gray-900">{{ reservation.purpose }}</p>
            </div>

            <div v-if="reservation.specialRequirements" class="mt-6">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Requerimientos Especiales</h3>
              <p class="text-gray-900">{{ reservation.specialRequirements }}</p>
            </div>

            <div v-if="reservation.contactPhone" class="mt-6">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Teléfono de Contacto</h3>
              <p class="text-gray-900">{{ reservation.contactPhone }}</p>
            </div>
          </div>

          <!-- Timeline -->
          <div class="card">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Historial</h2>
            
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">Reserva creada</p>
                  <p class="text-xs text-gray-500">{{ formatDateTime(reservation.createdAt) }}</p>
                </div>
              </div>
              
              <div v-if="reservation.status !== 'PENDING'" class="flex items-start">
                <div 
                  :class="[
                    'flex-shrink-0 w-2 h-2 rounded-full mt-2',
                    reservation.status === 'CONFIRMED' ? 'bg-green-600' : 
                    reservation.status === 'CANCELLED' ? 'bg-red-600' : 'bg-gray-600'
                  ]"
                ></div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">
                    Estado actualizado a {{ getStatusText(reservation.status) }}
                  </p>
                  <p class="text-xs text-gray-500">{{ formatDateTime(reservation.updatedAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Space Info -->
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Información del Espacio</h2>
            
            <div v-if="reservation.space" class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-700">Nombre</h3>
                <p class="text-gray-900">{{ reservation.space.name }}</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-700">Descripción</h3>
                <p class="text-gray-900 text-sm">{{ reservation.space.description }}</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-700">Capacidad</h3>
                <p class="text-gray-900">{{ reservation.space.capacity }} personas</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-700">Ubicación</h3>
                <p class="text-gray-900">{{ reservation.space.location }}</p>
              </div>
              
              <div v-if="reservation.space.amenities?.length">
                <h3 class="text-sm font-medium text-gray-700 mb-2">Servicios</h3>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="amenity in reservation.space.amenities"
                    :key="amenity"
                    class="badge badge-secondary"
                  >
                    {{ amenity }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Contacto</h2>
            
            <div class="space-y-3">
              <div>
                <h3 class="text-sm font-medium text-gray-700">Administración</h3>
                <p class="text-gray-900">admin@espacios.com</p>
                <p class="text-gray-900">+52 999 123 4567</p>
              </div>
              
              <div class="pt-3 border-t border-gray-200">
                <p class="text-xs text-gray-500">
                  Para cualquier modificación o cancelación, contacta con al menos 24 horas de anticipación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReservationStore } from '~/stores/reservation'
import { useUserStore } from '~/stores/user'
import type { Reservation, ReservationStatus } from '~/types'

// Route and router
const route = useRoute()
const router = useRouter()

// Stores
const reservationStore = useReservationStore()
const userStore = useUserStore()

// Reactive data
const loading = ref(true)
const reservation = ref<Reservation | null>(null)
const showEditModal = ref(false)

// Computed
const canModify = computed(() => {
  return reservation.value && 
    (reservation.value.status === 'PENDING' || reservation.value.status === 'CONFIRMED') &&
    new Date(reservation.value.startTime) > new Date()
})

const canCancel = computed(() => {
  return reservation.value && 
    (reservation.value.status === 'PENDING' || reservation.value.status === 'CONFIRMED')
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function cancelReservation() {
  if (!reservation.value) return

  if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
    return
  }

  try {
    await reservationStore.cancelReservation(reservation.value.id)
    reservation.value.status = 'CANCELLED'
    reservation.value.updatedAt = new Date().toISOString()
  } catch (error) {
    console.error('Error al cancelar reserva:', error)
  }
}

// Lifecycle
onMounted(async () => {
  const reservationId = route.params.id as string
  
  try {
    const fetchedReservation = await reservationStore.fetchReservation(reservationId)
    if (fetchedReservation) {
      reservation.value = fetchedReservation
      
      // Check if user has permission to view this reservation
      if (userStore.currentUser) {
        const isOwner = reservation.value.userId === userStore.currentUser.id
        const isAdmin = userStore.currentUser.role === 'admin'
        
        if (!isOwner && !isAdmin) {
          await router.push('/reservations')
          return
        }
      }
    } else {
      await router.push('/reservations')
      return
    }
  } catch (error) {
    console.error('Error al cargar reserva:', error)
    reservation.value = null
  } finally {
    loading.value = false
  }
})

// Meta
definePageMeta({
  title: 'Detalles de Reserva'
})
</script>
