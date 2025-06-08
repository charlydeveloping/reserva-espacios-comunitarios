<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Mis Reservas</h1>
        <p class="text-gray-600">Gestiona tus reservas de espacios comunitarios</p>
      </div>
      <NuxtLink
        to="/reservations/new"
        class="btn-primary mt-4 lg:mt-0 inline-flex items-center"
      >
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        Nueva Reserva
      </NuxtLink>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Reservas</p>
            <p class="text-2xl font-semibold text-gray-900">{{ reservationStore.reservations.length }}</p>
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
            <p class="text-2xl font-semibold text-gray-900">{{ confirmedCount }}</p>
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
            <p class="text-2xl font-semibold text-gray-900">{{ pendingCount }}</p>
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
            v-model="selectedStatus"
            class="form-input"
          >
            <option value="">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
            <option value="CONFIRMED">Confirmada</option>
            <option value="CANCELLED">Cancelada</option>
            <option value="COMPLETED">Completada</option>
          </select>
        </div>
        
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Desde</label>
          <input
            v-model="dateFrom"
            type="date"
            class="form-input"
          />
        </div>
        
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
          <input
            v-model="dateTo"
            type="date"
            class="form-input"
          />
        </div>
      </div>
    </div>

    <!-- Reservations List -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Cargando reservas...</p>
    </div>

    <div v-else-if="filteredReservations.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No hay reservas</h3>
      <p class="mt-2 text-gray-500">Comienza creando tu primera reserva.</p>
      <NuxtLink to="/reservations/new" class="btn-primary mt-4 inline-flex items-center">
        Nueva Reserva
      </NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="reservation in filteredReservations"
        :key="reservation.id"
        class="card hover:shadow-lg transition-shadow duration-200"
      >
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <h3 class="text-lg font-semibold text-gray-900 mr-3">
                {{ reservation.space?.name || 'Espacio no encontrado' }}
              </h3>
              <span
                :class="getStatusBadgeClass(reservation.status)"
                class="badge"
              >
                {{ getStatusText(reservation.status) }}
              </span>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div class="flex items-center">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                {{ formatDate(reservation.startTime) }}
              </div>
              
              <div class="flex items-center">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ formatTime(reservation.startTime) }} - {{ formatTime(reservation.endTime) }}
              </div>
              
              <div class="flex items-center">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                {{ reservation.attendees || 1 }} persona(s)
              </div>
              
              <div v-if="reservation.purpose" class="flex items-center">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                {{ reservation.purpose }}
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-2 mt-4 sm:mt-0">
            <NuxtLink
              :to="`/reservations/${reservation.id}`"
              class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Ver detalles
            </NuxtLink>
            
            <button
              v-if="reservation.status === 'PENDING' || reservation.status === 'CONFIRMED'"
              @click="cancelReservation(reservation.id)"
              class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReservationStore } from '~/stores/reservation'
import { useUserStore } from '~/stores/user'
import type { ReservationStatus } from '~/types'

// Meta
definePageMeta({
  title: 'Mis Reservas'
})

// Stores
const reservationStore = useReservationStore()
const userStore = useUserStore()

// Reactive data
const loading = ref(false)
const selectedStatus = ref('')
const dateFrom = ref('')
const dateTo = ref('')

// Computed
const confirmedCount = computed(() => 
  reservationStore.reservations.filter(r => r.status === 'CONFIRMED').length
)

const pendingCount = computed(() => 
  reservationStore.reservations.filter(r => r.status === 'PENDING').length
)

const filteredReservations = computed(() => {
  let filtered = reservationStore.reservations

  if (selectedStatus.value) {
    filtered = filtered.filter(r => r.status === selectedStatus.value)
  }

  if (dateFrom.value) {
    filtered = filtered.filter(r => new Date(r.startTime) >= new Date(dateFrom.value))
  }

  if (dateTo.value) {
    filtered = filtered.filter(r => new Date(r.startTime) <= new Date(dateTo.value))
  }

  return filtered.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
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

async function cancelReservation(id: string) {
  if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
    return
  }

  try {
    await reservationStore.cancelReservation(id)
  } catch (error) {
    console.error('Error al cancelar reserva:', error)
  }
}

// Lifecycle
onMounted(async () => {
  loading.value = true
  try {
    if (userStore.currentUser) {
      await reservationStore.fetchUserReservations(userStore.currentUser.id)
    }
  } catch (error) {
    console.error('Error al cargar reservas:', error)
  } finally {
    loading.value = false
  }
})
</script>
