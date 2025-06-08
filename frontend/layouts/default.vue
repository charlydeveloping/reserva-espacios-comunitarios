<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and Navigation -->
          <div class="flex items-center space-x-8">
            <NuxtLink to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">RC</span>
              </div>
              <span class="font-semibold text-gray-900 text-lg">Reserva Comunitaria</span>
            </NuxtLink>
            
            <!-- Navigation Menu -->
            <nav class="hidden md:flex space-x-6">
              <NuxtLink 
                to="/spaces" 
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-blue-600 bg-blue-50"
              >
                Espacios
              </NuxtLink>
              <NuxtLink 
                to="/reservations" 
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-blue-600 bg-blue-50"
              >
                Reservas
              </NuxtLink>
              <NuxtLink 
                to="/notifications" 
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors relative"
                active-class="text-blue-600 bg-blue-50"
              >
                Notificaciones
                <!-- Notification badge -->
                <span 
                  v-if="unreadCount > 0"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {{ unreadCount > 99 ? '99+' : unreadCount }}
                </span>
              </NuxtLink>
              <NuxtLink 
                v-if="userStore.currentUser"
                to="/dashboard" 
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="text-blue-600 bg-blue-50"
              >
                Dashboard
              </NuxtLink>
            </nav>
          </div>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- User info and actions -->
            <div v-if="userStore.currentUser" class="flex items-center space-x-3">
              <span class="text-sm text-gray-700">
                Hola, {{ userStore.currentUser.name }}
              </span>
              <button 
                @click="logout"
                class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
            
            <!-- Login button if not authenticated -->
            <NuxtLink 
              v-else
              to="/login" 
              class="btn-primary text-sm"
            >
              Iniciar Sesión
            </NuxtLink>

            <!-- Mobile menu button -->
            <button 
              @click="toggleMobileMenu"
              class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div v-if="showMobileMenu" class="md:hidden py-4 border-t border-gray-200">
          <nav class="flex flex-col space-y-2">
            <NuxtLink 
              to="/spaces" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
              @click="closeMobileMenu"
            >
              Espacios
            </NuxtLink>
            <NuxtLink 
              to="/reservations" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
              @click="closeMobileMenu"
            >
              Reservas
            </NuxtLink>
            <NuxtLink 
              to="/notifications" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
              @click="closeMobileMenu"
            >
              Notificaciones
            </NuxtLink>
            <NuxtLink 
              v-if="userStore.currentUser"
              to="/dashboard" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
              @click="closeMobileMenu"
            >
              Dashboard
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center space-x-2 mb-4 md:mb-0">
            <div class="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span class="text-white font-bold text-xs">RC</span>
            </div>
            <span class="text-gray-600 text-sm">© 2025 Reserva Comunitaria</span>
          </div>
          <div class="flex space-x-6 text-sm text-gray-500">
            <a href="#" class="hover:text-gray-700">Términos</a>
            <a href="#" class="hover:text-gray-700">Privacidad</a>
            <a href="#" class="hover:text-gray-700">Contacto</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const router = useRouter()

// Mobile menu state
const showMobileMenu = ref(false)

// Mock unread notifications count (replace with real data)
const unreadCount = ref(3)

// Toggle mobile menu
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

// Close mobile menu
const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// Logout function
const logout = () => {
  userStore.logout()
  router.push('/')
}

// Close mobile menu when route changes
watch(() => router.currentRoute.value, () => {
  closeMobileMenu()
})
</script>
