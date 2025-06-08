<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Espacios Disponibles</h1>
        <p class="text-gray-600">Encuentra el espacio perfecto para tu evento o actividad</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink 
          to="/spaces/new"
          class="btn-primary"
        >
          + Agregar Espacio
        </NuxtLink>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search by name -->
        <div>
          <label class="form-label">Buscar por nombre</label>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Nombre del espacio..."
            class="form-input"
          >
        </div>

        <!-- Filter by type -->
        <div>
          <label class="form-label">Tipo de espacio</label>
          <select v-model="selectedType" class="form-input">
            <option value="">Todos los tipos</option>
            <option 
              v-for="type in spaceTypeOptions" 
              :key="type.value" 
              :value="type.value"
            >
              {{ type.label }}
            </option>
          </select>
        </div>

        <!-- Filter by capacity -->
        <div>
          <label class="form-label">Capacidad mínima</label>
          <input 
            v-model.number="minCapacity"
            type="number" 
            placeholder="Ej: 10"
            class="form-input"
            min="1"
          >
        </div>

        <!-- Clear filters -->
        <div class="flex items-end">
          <button 
            @click="clearFilters"
            class="btn-secondary w-full"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="spaceStore.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Cargando espacios...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="spaceStore.error" class="text-center py-12">
      <div class="text-red-600 mb-4">❌ {{ spaceStore.error }}</div>
      <button @click="spaceStore.fetchSpaces()" class="btn-primary">
        Reintentar
      </button>
    </div>

    <!-- Spaces Grid -->
    <div v-else-if="filteredSpaces.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="space in filteredSpaces" 
        :key="space.id"
        class="card hover:shadow-lg transition-shadow duration-200"
      >
        <!-- Space Image Placeholder -->
        <div class="h-48 bg-gradient-to-br from-blue-400 to-blue-600 relative">
          <div class="absolute inset-0 flex items-center justify-center text-white text-4xl">
            {{ getSpaceIcon(space.tipo) }}
          </div>
          <div class="absolute top-4 right-4">
            <span :class="getSpaceTypeBadgeClass(space.tipo)">
              {{ getSpaceTypeLabel(space.tipo) }}
            </span>
          </div>
        </div>

        <!-- Space Info -->
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ space.nombre }}</h3>
          
          <div class="flex items-center text-gray-600 mb-4">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Capacidad: {{ space.capacidad }} personas</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">
              Creado: {{ formatDate(space.createdAt) }}
            </span>
            
            <div class="flex space-x-2">
              <NuxtLink 
                :to="`/spaces/${space.id}`"
                class="btn-secondary text-sm"
              >
                Ver Detalles
              </NuxtLink>
              <NuxtLink 
                :to="`/reservations/new?spaceId=${space.id}`"
                class="btn-primary text-sm"
              >
                Reservar
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">🏢</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No se encontraron espacios</h3>
      <p class="text-gray-600 mb-4">
        {{ searchQuery || selectedType || minCapacity ? 'Intenta ajustar los filtros de búsqueda' : 'Aún no hay espacios registrados' }}
      </p>
      <div class="flex justify-center space-x-4">
        <button v-if="searchQuery || selectedType || minCapacity" @click="clearFilters" class="btn-secondary">
          Limpiar Filtros
        </button>
        <NuxtLink to="/spaces/new" class="btn-primary">
          Agregar Primer Espacio
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Footer -->
    <div v-if="filteredSpaces.length > 0" class="mt-12 bg-gray-50 rounded-lg p-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div class="text-2xl font-bold text-blue-600">{{ filteredSpaces.length }}</div>
          <div class="text-sm text-gray-600">Espacios mostrados</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-green-600">{{ availableSpacesCount }}</div>
          <div class="text-sm text-gray-600">Disponibles ahora</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-purple-600">{{ averageCapacity }}</div>
          <div class="text-sm text-gray-600">Capacidad promedio</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-orange-600">{{ spaceTypes.length }}</div>
          <div class="text-sm text-gray-600">Tipos de espacios</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page meta
useHead({
  title: 'Espacios',
  meta: [
    { name: 'description', content: 'Explora todos los espacios comunitarios disponibles para reservar' }
  ]
})

// Stores
const spaceStore = useSpaceStore()
const { getSpaceTypes, getSpaceTypeLabel } = useSpaces()

// Reactive data
const searchQuery = ref('')
const selectedType = ref('')
const minCapacity = ref<number | null>(null)

// Load spaces on mount
onMounted(() => {
  if (spaceStore.spaces.length === 0) {
    spaceStore.fetchSpaces()
  }
})

// Space type options
const spaceTypeOptions = getSpaceTypes()

// Computed filtered spaces
const filteredSpaces = computed(() => {
  let filtered = spaceStore.spaces

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(space => 
      space.nombre.toLowerCase().includes(query)
    )
  }

  // Filter by type
  if (selectedType.value) {
    filtered = filtered.filter(space => space.tipo === selectedType.value)
  }

  // Filter by capacity
  if (minCapacity.value) {
    filtered = filtered.filter(space => space.capacidad >= minCapacity.value!)
  }

  return filtered
})

// Computed stats
const availableSpacesCount = computed(() => {
  // This would be calculated based on current reservations
  return Math.floor(filteredSpaces.value.length * 0.8) // Mock: 80% available
})

const averageCapacity = computed(() => {
  if (filteredSpaces.value.length === 0) return 0
  const total = filteredSpaces.value.reduce((sum, space) => sum + space.capacidad, 0)
  return Math.round(total / filteredSpaces.value.length)
})

const spaceTypes = computed(() => {
  const types = new Set(filteredSpaces.value.map(space => space.tipo))
  return Array.from(types)
})

// Helper functions
const clearFilters = () => {
  searchQuery.value = ''
  selectedType.value = ''
  minCapacity.value = null
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getSpaceIcon = (type: string) => {
  const icons: Record<string, string> = {
    'sala_reunion': '🏢',
    'auditorio': '🎭',
    'cancha_deportiva': '⚽',
    'salon_eventos': '🎉',
    'laboratorio': '🔬',
    'biblioteca': '📚'
  }
  return icons[type] || '🏢'
}

const getSpaceTypeBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    'sala_reunion': 'badge-info',
    'auditorio': 'badge-success',
    'cancha_deportiva': 'badge-warning',
    'salon_eventos': 'badge-error',
    'laboratorio': 'badge-info',
    'biblioteca': 'badge-success'
  }
  return `badge ${classes[type] || 'badge-info'}`
}
</script>
