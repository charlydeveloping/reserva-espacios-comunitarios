<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crear Cuenta
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Únete para acceder a los espacios comunitarios
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Nombre completo
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="form-input mt-1"
              placeholder="Tu nombre completo"
            />
          </div>
          
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
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="form-input mt-1"
              placeholder="+52 999 123 4567"
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
              minlength="6"
              class="form-input mt-1"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="form-input mt-1"
              placeholder="Repite tu contraseña"
            />
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="agree-terms"
            v-model="form.agreeTerms"
            type="checkbox"
            required
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="agree-terms" class="ml-2 block text-sm text-gray-900">
            Acepto los 
            <a href="#" class="text-blue-600 hover:text-blue-500">términos y condiciones</a>
            y la 
            <a href="#" class="text-blue-600 hover:text-blue-500">política de privacidad</a>
          </label>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-800">{{ success }}</p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            ¿Ya tienes una cuenta?
            <NuxtLink to="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
              Inicia sesión aquí
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import type { CreateUserDto } from '~/types'

// Meta
definePageMeta({
  title: 'Crear Cuenta',
  layout: false // Use no layout for auth pages
})

// Store
const userStore = useUserStore()

// Router
const router = useRouter()

// Reactive data
const loading = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

// Methods
function validateForm(): string | null {
  if (form.password !== form.confirmPassword) {
    return 'Las contraseñas no coinciden'
  }
  
  if (form.password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres'
  }
  
  if (!form.agreeTerms) {
    return 'Debes aceptar los términos y condiciones'
  }
  
  return null
}

async function handleRegister() {
  error.value = ''
  success.value = ''
  
  // Validate form
  const validationError = validateForm()
  if (validationError) {
    error.value = validationError
    return
  }
  
  loading.value = true

  try {
    const userData: CreateUserDto = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone || undefined,
      role: 'user' // Default role
    }

    await userStore.register(userData)
    
    success.value = 'Cuenta creada exitosamente. Redirigiendo...'
    
    // Wait a moment to show success message, then redirect
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
    
  } catch (err: any) {
    console.error('Registration error:', err)
    error.value = err.message || 'Error al crear la cuenta. Intenta nuevamente.'
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
