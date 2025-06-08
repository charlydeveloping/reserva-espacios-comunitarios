<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-4">
        <NuxtLink 
          to="/spaces" 
          class="btn-secondary p-2"
          title="Volver a espacios"
        >
          ← 
        </NuxtLink>
        <h1 class="text-3xl font-bold text-gray-900">Agregar Nuevo Espacio</h1>
      </div>
      <p class="text-gray-600">Completa la información del espacio comunitario</p>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Información Básica
          </h2>

          <!-- Name -->
          <div>
            <label for="name" class="form-label required">Nombre del Espacio</label>
            <input
              id="name"
              v-model="form.nombre"
              type="text"
              placeholder="Ej: Auditorio Principal, Sala de Reuniones A..."
              class="form-input"
              :class="{ 'border-red-500': errors.nombre }"
              required
            >
            <p v-if="errors.nombre" class="form-error">{{ errors.nombre }}</p>
          </div>

          <!-- Type -->
          <div>
            <label for="type" class="form-label required">Tipo de Espacio</label>
            <select
              id="type"
              v-model="form.tipo"
              class="form-input"
              :class="{ 'border-red-500': errors.tipo }"
              required
            >
              <option value="">Selecciona un tipo</option>
              <option 
                v-for="type in spaceTypeOptions" 
                :key="type.value" 
                :value="type.value"
              >
                {{ type.label }}
              </option>
            </select>
            <p v-if="errors.tipo" class="form-error">{{ errors.tipo }}</p>
          </div>

          <!-- Capacity -->
          <div>
            <label for="capacity" class="form-label required">Capacidad</label>
            <input
              id="capacity"
              v-model.number="form.capacidad"
              type="number"
              min="1"
              placeholder="Número máximo de personas"
              class="form-input"
              :class="{ 'border-red-500': errors.capacidad }"
              required
            >
            <p v-if="errors.capacidad" class="form-error">{{ errors.capacidad }}</p>
            <p class="form-help">Número máximo de personas que puede albergar el espacio</p>
          </div>

          <!-- Location -->
          <div>
            <label for="location" class="form-label">Ubicación</label>
            <input
              id="location"
              v-model="form.location"
              type="text"
              placeholder="Ej: Edificio A, Piso 2, Sector Norte..."
              class="form-input"
              :class="{ 'border-red-500': errors.location }"
            >
            <p v-if="errors.location" class="form-error">{{ errors.location }}</p>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="form-label">Descripción</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              placeholder="Describe las características del espacio, su uso recomendado..."
              class="form-input"
              :class="{ 'border-red-500': errors.description }"
            />
            <p v-if="errors.description" class="form-error">{{ errors.description }}</p>
          </div>
        </div>

        <!-- Amenities -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Servicios y Equipamiento
          </h2>

          <div>
            <label class="form-label">Servicios Disponibles</label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              <label 
                v-for="amenity in availableAmenities" 
                :key="amenity"
                class="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  v-model="form.amenities"
                  type="checkbox"
                  :value="amenity"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                >
                <span class="text-sm text-gray-700">{{ amenity }}</span>
              </label>
            </div>
            <p class="form-help mt-2">Selecciona todos los servicios disponibles en el espacio</p>
          </div>
        </div>

        <!-- Custom Amenity -->
        <div class="bg-gray-50 rounded-lg p-4">
          <label for="customAmenity" class="form-label">Agregar Servicio Personalizado</label>
          <div class="flex gap-2">
            <input
              id="customAmenity"
              v-model="customAmenity"
              type="text"
              placeholder="Nombre del servicio..."
              class="form-input flex-1"
              @keyup.enter="addCustomAmenity"
            >
            <button
              type="button"
              @click="addCustomAmenity"
              class="btn-secondary"
              :disabled="!customAmenity.trim()"
            >
              Agregar
            </button>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn-primary flex-1 sm:flex-none sm:px-8"
          >
            <span v-if="isSubmitting" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </span>
            <span v-else>Crear Espacio</span>
          </button>
          
          <NuxtLink 
            to="/spaces" 
            class="btn-secondary flex-1 sm:flex-none sm:px-8 text-center"
          >
            Cancelar
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateSpaceDto, SpaceType } from '~/types'

// Meta tags
definePageMeta({
  title: 'Agregar Nuevo Espacio'
})

// Composables
const { createSpace } = useSpaces()
const router = useRouter()

// Reactive data
const isSubmitting = ref(false)
const customAmenity = ref('')
const errors = ref<Record<string, string>>({})

// Form data
const form = reactive<CreateSpaceDto>({
  nombre: '',
  tipo: '' as SpaceType,
  capacidad: 1,
  description: '',
  location: '',
  amenities: []
})

// Space type options
const spaceTypeOptions = [
  { value: 'sala_reunion', label: 'Sala de Reuniones' },
  { value: 'auditorio', label: 'Auditorio' },
  { value: 'cancha_deportiva', label: 'Cancha Deportiva' },
  { value: 'salon_eventos', label: 'Salón de Eventos' },
  { value: 'laboratorio', label: 'Laboratorio' },
  { value: 'biblioteca', label: 'Biblioteca' }
]

// Available amenities
const availableAmenities = [
  'Proyector',
  'Pantalla',
  'Audio/Sonido',
  'Micrófono',
  'WiFi',
  'Aire Acondicionado',
  'Calefacción',
  'Pizarra/Whiteboard',
  'Mesa de Conferencias',
  'Sillas',
  'Cocina/Kitchenette',
  'Baño Privado',
  'Estacionamiento',
  'Acceso para Discapacitados',
  'Iluminación LED',
  'Ventanas/Luz Natural',
  'Sistema de Videoconferencia',
  'Computadoras',
  'Impresora',
  'Escáner'
]

// Methods
const addCustomAmenity = () => {
  const amenity = customAmenity.value.trim()
  if (amenity && !form.amenities?.includes(amenity)) {
    if (!form.amenities) form.amenities = []
    form.amenities.push(amenity)
    customAmenity.value = ''
  }
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.nombre.trim()) {
    errors.value.nombre = 'El nombre es requerido'
  } else if (form.nombre.length < 3) {
    errors.value.nombre = 'El nombre debe tener al menos 3 caracteres'
  }

  if (!form.tipo) {
    errors.value.tipo = 'El tipo de espacio es requerido'
  }

  if (!form.capacidad || form.capacidad < 1) {
    errors.value.capacidad = 'La capacidad debe ser mayor a 0'
  } else if (form.capacidad > 1000) {
    errors.value.capacidad = 'La capacidad no puede ser mayor a 1000'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // Only send the fields that the backend expects
    const spaceData = {
      nombre: form.nombre,
      tipo: form.tipo,
      capacidad: form.capacidad
    }
    
    const newSpace = await createSpace(spaceData)
    
    // Success notification
    const { addNotification } = useNotifications()
    addNotification({
      type: 'success',
      title: 'Espacio creado',
      message: `El espacio "${newSpace.nombre}" ha sido creado exitosamente`
    })

    // Redirect to spaces list
    await router.push('/spaces')
  } catch (error: any) {
    console.error('Error creating space:', error)
    
    const { addNotification } = useNotifications()
    addNotification({
      type: 'error',
      title: 'Error al crear espacio',
      message: error.message || 'Hubo un problema al crear el espacio. Inténtalo nuevamente.'
    })
  } finally {
    isSubmitting.value = false
  }
}

// Watch for form changes to clear errors
watch(form, () => {
  // Clear specific field errors when user starts typing
  Object.keys(errors.value).forEach(field => {
    if (form[field as keyof CreateSpaceDto]) {
      delete errors.value[field]
    }
  })
}, { deep: true })
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-label.required::after {
  content: " *";
  @apply text-red-500;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors;
}

.form-error {
  @apply text-sm text-red-600 mt-1;
}

.form-help {
  @apply text-sm text-gray-500 mt-1;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>
