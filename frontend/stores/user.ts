import { defineStore } from 'pinia'
import type { User, CreateUserDto, UpdateUserDto } from '~/types'

interface UserState {
  users: User[]
  currentUser: User | null
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    getUserById: (state) => (id: string) => {
      return state.users.find(user => user.id === id)
    },
    totalUsers: (state) => state.users.length,
  },

  actions: {
    // Set loading state
    setLoading(loading: boolean) {
      this.loading = loading
    },

    // Set error state
    setError(error: string | null) {
      this.error = error
    },

    // Set current user
    setCurrentUser(user: User | null) {
      this.currentUser = user
    },

    // Fetch all users
    async fetchUsers() {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const { getUsers } = useUsers()
        const { data } = await getUsers()
        
        if (data.value) {
          this.users = data.value
        }
      } catch (error: any) {
        this.setError(error.message || 'Error al cargar usuarios')
      } finally {
        this.setLoading(false)
      }
    },

    // Fetch user by ID
    async fetchUserById(id: string) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const { getUserById } = useUsers()
        const { data } = await getUserById(id)
        
        if (data.value) {
          // Update user in the list or add if not exists
          const index = this.users.findIndex(user => user.id === id)
          if (index !== -1) {
            this.users[index] = data.value
          } else {
            this.users.push(data.value)
          }
          return data.value
        }
      } catch (error: any) {
        this.setError(error.message || 'Error al cargar usuario')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Create new user
    async createUser(userData: CreateUserDto) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const { createUser } = useUsers()
        const newUser = await createUser(userData)
        
        this.users.push(newUser)
        return newUser
      } catch (error: any) {
        this.setError(error.message || 'Error al crear usuario')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Update user
    async updateUser(id: string, userData: UpdateUserDto) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const { updateUser } = useUsers()
        const updatedUser = await updateUser(id, userData)
        
        // Update user in the list
        const index = this.users.findIndex(user => user.id === id)
        if (index !== -1) {
          this.users[index] = updatedUser
        }
        
        // Update current user if it's the same
        if (this.currentUser?.id === id) {
          this.currentUser = updatedUser
        }
        
        return updatedUser
      } catch (error: any) {
        this.setError(error.message || 'Error al actualizar usuario')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Search users by name
    async searchUsers(name: string) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const { searchUsersByName } = useUsers()
        const { data } = await searchUsersByName(name)
        
        return data.value || []
      } catch (error: any) {
        this.setError(error.message || 'Error al buscar usuarios')
        return []
      } finally {
        this.setLoading(false)
      }
    },

    // Login (simulate authentication)
    async login(credentials: { email: string; password: string }) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        // Demo users for testing
        const demoUsers = [
          { id: '1', name: 'Admin Usuario', email: 'admin@test.com', role: 'admin' as const, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
          { id: '2', name: 'Usuario Normal', email: 'user@test.com', role: 'user' as const, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        ]
        
        const user = demoUsers.find(u => u.email === credentials.email)
        if (user && credentials.password === 'password') {
          this.setCurrentUser(user)
          return user
        } else {
          throw new Error('Credenciales inválidas')
        }
      } catch (error: any) {
        this.setError(error.message || 'Error al iniciar sesión')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Register user
    async register(userData: CreateUserDto) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const { createUser } = useUsers()
        const newUser = await createUser(userData)
        
        this.users.push(newUser)
        this.setCurrentUser(newUser)
        
        return newUser
      } catch (error: any) {
        this.setError(error.message || 'Error al registrar usuario')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Logout
    logout() {
      this.setCurrentUser(null)
      this.setError(null)
    },

    // Clear error
    clearError() {
      this.setError(null)
    },
  },
})
