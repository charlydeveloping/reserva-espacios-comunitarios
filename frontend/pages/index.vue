<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Reserva de Espacios
            <span class="text-blue-200">Comunitarios</span>
          </h1>
          <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Gestiona fácilmente las reservas de espacios comunitarios. 
            Encuentra, reserva y administra todos tus espacios desde una sola plataforma.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/spaces" 
              class="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
            >
              Ver Espacios
            </NuxtLink>
            <NuxtLink 
              to="/reservations/new" 
              class="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
            >
              Hacer Reserva
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir nuestro sistema?
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Simplificamos la gestión de espacios comunitarios con herramientas modernas y fáciles de usar
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Reservas Fáciles</h3>
            <p class="text-gray-600">
              Reserva espacios en pocos clics con nuestro calendario intuitivo. 
              Ve la disponibilidad en tiempo real.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM7 7h8l-4-4 4-4H7l4 4z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Gestión Centralizada</h3>
            <p class="text-gray-600">
              Administra todos los espacios desde un solo lugar. 
              Control total sobre disponibilidad y configuración.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM7 7h8l-4-4 4-4H7l4 4z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Notificaciones Smart</h3>
            <p class="text-gray-600">
              Recibe recordatorios automáticos y confirmaciones. 
              Nunca te pierdas una reserva importante.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{{ totalSpaces }}</div>
            <div class="text-gray-600">Espacios Disponibles</div>
          </div>
          <div>
            <div class="text-3xl md:text-4xl font-bold text-green-600 mb-2">{{ totalReservations }}</div>
            <div class="text-gray-600">Reservas Activas</div>
          </div>
          <div>
            <div class="text-3xl md:text-4xl font-bold text-purple-600 mb-2">{{ totalUsers }}</div>
            <div class="text-gray-600">Usuarios Registrados</div>
          </div>
          <div>
            <div class="text-3xl md:text-4xl font-bold text-orange-600 mb-2">24/7</div>
            <div class="text-gray-600">Disponibilidad</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-blue-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          ¿Listo para comenzar?
        </h2>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Únete a nuestra comunidad y comienza a gestionar espacios de manera eficiente
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            to="/spaces" 
            class="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
          >
            Explorar Espacios
          </NuxtLink>
          <NuxtLink 
            v-if="!userStore.currentUser"
            to="/register" 
            class="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
          >
            Registrarse
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Page meta
useHead({
  title: 'Inicio',
  meta: [
    { name: 'description', content: 'Sistema de reservas para espacios comunitarios - Gestiona fácilmente todas tus reservas' }
  ]
})

// Stores
const userStore = useUserStore()
const spaceStore = useSpaceStore()
const reservationStore = useReservationStore()

// Load initial data
onMounted(async () => {
  await Promise.all([
    spaceStore.fetchSpaces(),
    reservationStore.fetchReservations(),
    userStore.fetchUsers()
  ])
})

// Computed stats
const totalSpaces = computed(() => spaceStore.totalSpaces || 6)
const totalReservations = computed(() => reservationStore.activeReservations.length || 24)
const totalUsers = computed(() => userStore.totalUsers || 4)
</script>
