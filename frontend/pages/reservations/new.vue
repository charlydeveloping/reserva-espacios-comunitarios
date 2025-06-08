<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Nueva Reserva</h1>
        <p class="text-gray-600">Reserva un espacio comunitario para tu evento</p>
      </div>

      <div class="card">
        <form @submit.prevent="submitReservation">
          <!-- Space Selection -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Espacio *
            </label>
            <select
              v-model="form.spaceId"
              required
              class="form-input"
              @change="onSpaceChange"
            >
              <option value="">Selecciona un espacio</option>
              <option
                v-for="space in spaceStore.spaces"
                :key="space.id"
                :value="space.id"
              >
                {{ space.nombre }} - Capacidad: {{ space.capacidad }} personas
              </option>
            </select>
          </div>

          <!-- Selected Space Info -->
          <div v-if="selectedSpace" class="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 class="font-medium text-blue-900 mb-2">{{ selectedSpace.nombre }}</h3>
            <p class="text-sm text-blue-700 mb-2">{{ selectedSpace.description }}</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="amenity in selectedSpace.amenities"
                :key="amenity"
                class="badge badge-info"
              >
                {{ amenity }}
              </span>
            </div>
          </div>

          <!-- Date -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fecha *
            </label>
            <input
              v-model="form.date"
              type="date"
              required
              :min="minDate"
              class="form-input"
              @change="checkAvailability"
            />
          </div>

          <!-- Time Range -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Hora de inicio *
              </label>
              <input
                v-model="form.startTime"
                type="time"
                required
                class="form-input"
                @change="checkAvailability"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Hora de fin *
              </label>
              <input
                v-model="form.endTime"
                type="time"
                required
                class="form-input"
                @change="checkAvailability"
              />
            </div>
          </div>

          <!-- Availability Check -->
          <div v-if="availabilityMessage" class="mb-6">
            <div
              :class="[
                'p-3 rounded-lg',
                isAvailable ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              ]"
            >
              <div class="flex items-center">
                <svg
                  :class="[
                    'h-5 w-5 mr-2',
                    isAvailable ? 'text-green-500' : 'text-red-500'
                  ]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    v-if="isAvailable"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {{ availabilityMessage }}
              </div>
            </div>
          </div>



          <!-- Error Message -->
          <div v-if="error" class="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>

          <!-- Submit Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              :disabled="loading || !isAvailable"
              class="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ loading ? 'Creando reserva...' : 'Crear Reserva' }}
            </button>
            
            <NuxtLink
              to="/reservations"
              class="btn-secondary flex-1 text-center"
            >
              Cancelar
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSpaceStore } from '~/stores/space'
import { useReservationStore } from '~/stores/reservation'
import { useUserStore } from '~/stores/user'
import type { CreateReservationDto } from '~/types'

// Meta
definePageMeta({
  title: 'Nueva Reserva'
})

// Stores
const spaceStore = useSpaceStore()
const reservationStore = useReservationStore()
const userStore = useUserStore()

// Router
const router = useRouter()

// Reactive data
const loading = ref(false)
const error = ref('')
const availabilityMessage = ref('')
const isAvailable = ref(false)

const form = reactive({
  spaceId: '',
  date: '',
  startTime: '',
  endTime: ''
})

// Computed
const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const selectedSpace = computed(() => {
  return spaceStore.spaces.find(space => space.id === form.spaceId)
})

// Methods
function onSpaceChange() {
  // Reset availability check when space changes
  availabilityMessage.value = ''
  isAvailable.value = false
}

async function checkAvailability() {
  if (!form.spaceId || !form.date || !form.startTime || !form.endTime) {
    availabilityMessage.value = ''
    isAvailable.value = false
    return
  }

  if (form.startTime >= form.endTime) {
    availabilityMessage.value = 'La hora de fin debe ser posterior a la hora de inicio'
    isAvailable.value = false
    return
  }

  try {
    const startDateTime = new Date(`${form.date}T${form.startTime}`)
    const endDateTime = new Date(`${form.date}T${form.endTime}`)
    
    const available = await reservationStore.checkAvailability(
      form.spaceId,
      startDateTime.toISOString(),
      endDateTime.toISOString()
    )

    if (available) {
      availabilityMessage.value = '✓ El espacio está disponible en el horario seleccionado'
      isAvailable.value = true
    } else {
      availabilityMessage.value = '✗ El espacio no está disponible en el horario seleccionado'
      isAvailable.value = false
    }
  } catch (error) {
    console.error('Error checking availability:', error)
    availabilityMessage.value = 'Error al verificar disponibilidad'
    isAvailable.value = false
  }
}

async function submitReservation() {
  if (!userStore.currentUser) {
    error.value = 'Debes iniciar sesión para crear una reserva'
    return
  }

  error.value = ''
  loading.value = true

  try {
    const reservationData: CreateReservationDto = {
      espacioId: form.spaceId,
      usuarioId: userStore.currentUser.id,
      fecha: form.date,
      horaInicio: form.startTime,
      horaFin: form.endTime
    }

    const reservation = await reservationStore.createReservation(reservationData)
    
    // Redirect to reservation details
    await router.push(`/reservations/${reservation.id}`)
  } catch (err: any) {
    console.error('Error creating reservation:', err)
    error.value = err.message || 'Error al crear la reserva'
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await spaceStore.fetchSpaces()
  } catch (error) {
    console.error('Error loading spaces:', error)
  }
})
</script>
