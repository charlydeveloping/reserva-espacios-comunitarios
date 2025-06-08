<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
          <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Accede a tu cuenta para gestionar reservas de espacios comunitarios
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="form-input mt-1"
              placeholder="correo@ejemplo.com"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="form-input mt-1"
              placeholder="Tu contraseña"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Recordarme
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            ¿No tienes una cuenta?
            <NuxtLink to="/auth/register" class="font-medium text-blue-600 hover:text-blue-500">
              Regístrate aquí
            </NuxtLink>
          </p>
        </div>
      </form>

      <!-- Demo Users -->
      <div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 class="text-sm font-medium text-yellow-800 mb-2">Usuarios de demostración:</h3>
        <div class="space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-yellow-700">Admin:</span>
            <button
              @click="fillDemo('admin@espacios.com', 'admin123')"
              class="text-yellow-800 hover:text-yellow-900 underline"
            >
              admin@espacios.com / admin123
            </button>
          </div>
          <div class="flex justify-between">
            <span class="text-yellow-700">Usuario:</span>
            <button
              @click="fillDemo('user@espacios.com', 'user123')"
              class="text-yellow-800 hover:text-yellow-900 underline"
            >
              user@espacios.com / user123
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'

// Meta
definePageMeta({
  title: 'Iniciar Sesión',
  layout: false // Use no layout for auth pages
})

// Store
const userStore = useUserStore()

// Router
const router = useRouter()
const route = useRoute()

// Reactive data
const loading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

// Methods
function fillDemo(email: string, password: string) {
  form.email = email
  form.password = password
}

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    await userStore.login({
      email: form.email,
      password: form.password
    })

    // Redirect to intended page or dashboard
    const redirectTo = route.query.redirect as string || '/dashboard'
    await router.push(redirectTo)
  } catch (err: any) {
    console.error('Login error:', err)
    error.value = err.message || 'Error al iniciar sesión. Verifica tus credenciales.'
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  // If user is already logged in, redirect to dashboard
  if (userStore.currentUser) {
    router.push('/dashboard')
  }
})
</script>
