<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Cargando espacio...</p>
    </div>

    <div v-else-if="!space" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">Espacio no encontrado</h3>
      <p class="mt-2 text-gray-500">El espacio que buscas no existe.</p>
      <NuxtLink to="/spaces" class="btn-primary mt-4 inline-flex items-center">
        Volver a espacios
      </NuxtLink>
    </div>

    <div v-else>
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <NuxtLink to="/spaces" class="hover:text-gray-700">Espacios</NuxtLink>
        <span>/</span>
        <span class="text-gray-900">{{ space.nombre }}</span>
      </nav>

      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8">
        <div class="flex-1">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ space.nombre }}</h1>
          <p class="text-xl text-gray-600 mb-4">{{ space.description }}</p>
          
          <div class="flex flex-wrap items-center gap-4 mb-4">
            <div class="flex items-center text-gray-700">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ space.location }}
            </div>
            
            <div class="flex items-center text-gray-700">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              Capacidad: {{ space.capacidad }} personas
            </div>

            <span
              :class="[
                'badge',
                space.available ? 'badge-success' : 'badge-error'
              ]"
            >
              {{ space.available ? 'Disponible' : 'No disponible' }}
            </span>
          </div>

          <!-- Amenities -->
          <div v-if="space.amenities && space.amenities.length > 0" class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Servicios disponibles</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="amenity in space.amenities"
                :key="amenity"
                class="badge badge-info"
              >
                {{ amenity }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-6 lg:mt-0 lg:ml-8">
          <NuxtLink
            :to="`/reservations/new?spaceId=${space.id}`"
            :class="[
              'btn-primary w-full lg:w-auto',
              !space.available && 'opacity-50 cursor-not-allowed pointer-events-none'
            ]"
          >
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Reservar Espacio
          </NuxtLink>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Details -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Images Gallery (placeholder) -->
          <div class="card">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Galería</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="i in 6"
                :key="i"
                class="aspect-video bg-gray-200 rounded-lg flex items-center justify-center"
              >
                <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Rules and Guidelines -->
          <div class="card">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Normas y Lineamientos</h2>
            <div class="space-y-4 text-gray-700">
              <div class="flex items-start">
                <svg class="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p>Mantener el espacio limpio y ordenado durante y después del uso</p>
              </div>
              
              <div class="flex items-start">
                <svg class="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p>Respetar los horarios de reserva y no exceder el tiempo asignado</p>
              </div>
              
              <div class="flex items-start">
                <svg class="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p>No exceder la capacidad máxima del espacio</p>
              </div>
              
              <div class="flex items-start">
                <svg class="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                <p>Prohibido fumar en todas las áreas del espacio</p>
              </div>
              
              <div class="flex items-start">
                <svg class="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                <p>No se permite el consumo de bebidas alcohólicas sin autorización previa</p>
              </div>
            </div>
          </div>

          <!-- Recent Reservations -->
          <div class="card">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Próximas Reservas</h2>
            
            <div v-if="upcomingReservations.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <p class="mt-2 text-gray-600">No hay reservas próximas para este espacio</p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="reservation in upcomingReservations"
                :key="reservation.id"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium text-gray-900">{{ reservation.purpose }}</p>
                    <p class="text-sm text-gray-600">
                      {{ formatDateTime(reservation.startTime) }} - {{ formatTime(reservation.endTime) }}
                    </p>
                    <p class="text-sm text-gray-600">
                      {{ reservation.attendees }} persona(s)
                    </p>
                  </div>
                  <span
                    :class="getStatusBadgeClass(reservation.status)"
                    class="badge"
                  >
                    {{ getStatusText(reservation.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Info -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Información Rápida</h3>
            
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Tipo:</span>
                <span class="text-gray-900 font-medium">{{ space.tipo || 'General' }}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">Capacidad:</span>
                <span class="text-gray-900 font-medium">{{ space.capacidad }} personas</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">Estado:</span>
                <span
                  :class="[
                    'font-medium',
                    space.available ? 'text-green-600' : 'text-red-600'
                  ]"
                >
                  {{ space.available ? 'Disponible' : 'No disponible' }}
                </span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">Creado:</span>
                <span class="text-gray-900">{{ formatDate(space.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Contacto</h3>
            
            <div class="space-y-3">
              <div>
                <p class="text-sm font-medium text-gray-700">Administración</p>
                <p class="text-gray-900">admin@espacios.com</p>
                <p class="text-gray-900">+52 999 123 4567</p>
              </div>
              
              <div class="pt-3 border-t border-gray-200">
                <p class="text-xs text-gray-500">
                  Para reservas o consultas específicas sobre este espacio, contacta con la administración.
                </p>
              </div>
            </div>
          </div>

          <!-- Availability Calendar Placeholder -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Disponibilidad</h3>
            
            <div class="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <div class="text-center">
                <svg class="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <p class="text-sm text-gray-600">Calendario próximamente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSpaceStore } from '~/stores/space'
import { useReservationStore } from '~/stores/reservation'
import type { Space, Reservation, ReservationStatus } from '~/types'

// Route
const route = useRoute()

// Stores
const spaceStore = useSpaceStore()
const reservationStore = useReservationStore()

// Reactive data
const loading = ref(true)
const space = ref<Space | null>(null)
const upcomingReservations = ref<Reservation[]>([])

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
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(async () => {
  const spaceId = route.params.id as string
  
  try {
    // Load space details
    const fetchedSpace = await spaceStore.fetchSpace(spaceId)
    if (fetchedSpace) {
      space.value = fetchedSpace
      
      // Load upcoming reservations for this space
      upcomingReservations.value = await reservationStore.fetchSpaceReservations(spaceId)
      // Filter only upcoming reservations
      const now = new Date()
      upcomingReservations.value = upcomingReservations.value
        .filter((r: any) => new Date(r.startTime) > now && r.status !== 'CANCELLED')
        .slice(0, 5) // Show only next 5 reservations
    }
  } catch (error) {
    console.error('Error loading space:', error)
    space.value = null
  } finally {
    loading.value = false
  }
})

// Meta
definePageMeta({
  title: 'Detalles del Espacio'
})
</script>
