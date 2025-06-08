import { defineStore } from 'pinia'
import type { Reservation, CreateReservationDto, ReservationStatus } from '~/types'

interface ReservationState {
  reservations: Reservation[]
  userReservations: Reservation[]
  selectedReservation: Reservation | null
  loading: boolean
  error: string | null
}

export const useReservationStore = defineStore('reservation', {
  state: (): ReservationState => ({
    reservations: [],
    userReservations: [],
    selectedReservation: null,
    loading: false,
    error: null,
  }),

  getters: {
    getReservationById: (state) => (id: string) => {
      return state.reservations.find(reservation => reservation.id === id)
    },
    
    getReservationsByStatus: (state) => (status: ReservationStatus) => {
      return state.reservations.filter(reservation => reservation.status === status)
    },
    
    getReservationsByUser: (state) => (userId: string) => {
      return state.reservations.filter(reservation => reservation.userId === userId)
    },
    
    getReservationsBySpace: (state) => (spaceId: string) => {
      return state.reservations.filter(reservation => reservation.spaceId === spaceId)
    },
    
    totalReservations: (state) => state.reservations.length,
    
    activeReservations: (state) => {
      return state.reservations.filter(r => r.status !== 'CANCELLED')
    },
    
    upcomingReservations: (state) => {
      const now = new Date()
      return state.reservations.filter(reservation => {
        const reservationDate = new Date(reservation.startTime)
        return reservationDate > now && reservation.status === 'CONFIRMED'
      })
    },
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

    // Set selected reservation
    setSelectedReservation(reservation: Reservation | null) {
      this.selectedReservation = reservation
    },

    // Fetch all reservations
    async fetchReservations(filters?: {
      userId?: string
      spaceId?: string
      status?: ReservationStatus
      startDate?: string
      endDate?: string
    }) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const { getReservations } = useReservations()
        const { data } = await getReservations(filters)
        
        if (data.value) {
          this.reservations = data.value
        }
      } catch (error: any) {
        this.setError(error.message || 'Error al cargar reservas')
      } finally {
        this.setLoading(false)
      }
    },

    // Fetch user reservations
    async fetchUserReservations(userId: string) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const { getUserReservations } = useReservations()
        const { data } = await getUserReservations(userId)
        
        if (data.value) {
          this.userReservations = data.value
        }
      } catch (error: any) {
        this.setError(error.message || 'Error al cargar reservas del usuario')
      } finally {
        this.setLoading(false)
      }
    },

    // Fetch reservation by ID
    async fetchReservationById(id: string) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const { getReservationById } = useReservations()
        const { data } = await getReservationById(id)
        
        if (data.value) {
          // Update reservation in the list or add if not exists
          const index = this.reservations.findIndex(reservation => reservation.id === id)
          if (index !== -1) {
            this.reservations[index] = data.value
          } else {
            this.reservations.push(data.value)
          }
          return data.value
        }
      } catch (error: any) {
        this.setError(error.message || 'Error al cargar reserva')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Create new reservation
    async createReservation(reservationData: CreateReservationDto) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const { createReservation } = useReservations()
        const newReservation = await createReservation(reservationData)
        
        this.reservations.push(newReservation)
        
        // Add to user reservations if it's for the current user
        const userStore = useUserStore()
        if (userStore.currentUser?.id === reservationData.userId) {
          this.userReservations.push(newReservation)
        }
        
        return newReservation
      } catch (error: any) {
        this.setError(error.message || 'Error al crear reserva')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Cancel reservation
    async cancelReservation(id: string) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const { cancelReservation } = useReservations()
        const cancelledReservation = await cancelReservation(id)
        
        // Update reservation in the list
        const index = this.reservations.findIndex(reservation => reservation.id === id)
        if (index !== -1) {
          this.reservations[index] = cancelledReservation
        }
        
        // Update in user reservations
        const userIndex = this.userReservations.findIndex(reservation => reservation.id === id)
        if (userIndex !== -1) {
          this.userReservations[userIndex] = cancelledReservation
        }
        
        return cancelledReservation
      } catch (error: any) {
        this.setError(error.message || 'Error al cancelar reserva')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Get reservations for a specific date range
    getReservationsInDateRange(startDate: string, endDate: string) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      return this.reservations.filter(reservation => {
        const reservationDate = new Date(reservation.date)
        return reservationDate >= start && reservationDate <= end
      })
    },

    // Check if a time slot is available for a space
    isTimeSlotAvailable(spaceId: string, date: string, startTime: string, endTime: string) {
      const conflicts = this.reservations.filter(reservation => {
        if (reservation.spaceId !== spaceId || reservation.status === 'CANCELLED') {
          return false
        }
        
        if (reservation.date !== date) {
          return false
        }
        
        const requestStart = new Date(startTime)
        const requestEnd = new Date(endTime)
        const reservationStart = new Date(reservation.startTime)
        const reservationEnd = new Date(reservation.endTime)
        
        // Check for overlap
        return requestStart < reservationEnd && requestEnd > reservationStart
      })
      
      return conflicts.length === 0
    },

    // Clear error
    clearError() {
      this.setError(null)
    },

    // Fetch reservation by ID
    async fetchReservation(id: string) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const { getReservationById } = useReservations()
        const { data } = await getReservationById(id)
        
        if (data.value) {
          this.setSelectedReservation(data.value)
          
          // Update in reservations list if exists
          const index = this.reservations.findIndex(reservation => reservation.id === id)
          if (index !== -1) {
            this.reservations[index] = data.value
          }
          
          return data.value
        }
      } catch (error: any) {
        this.setError(error.message || 'Error al cargar reserva')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Check availability
    async checkAvailability(spaceId: string, startTime: string, endTime: string) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        // Simple availability check based on existing reservations
        const conflictingReservations = this.reservations.filter(reservation => {
          if (reservation.spaceId !== spaceId || reservation.status === 'CANCELLED') {
            return false
          }
          
          const reservationStart = new Date(reservation.startTime).getTime()
          const reservationEnd = new Date(reservation.endTime).getTime()
          const checkStart = new Date(startTime).getTime()
          const checkEnd = new Date(endTime).getTime()
          
          // Check for time overlap
          return (checkStart < reservationEnd && checkEnd > reservationStart)
        })
        
        return conflictingReservations.length === 0
      } catch (error: any) {
        this.setError(error.message || 'Error al verificar disponibilidad')
        return false
      } finally {
        this.setLoading(false)
      }
    },

    // Fetch reservations for a specific space
    async fetchSpaceReservations(spaceId: string) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const { getReservations } = useReservations()
        const { data } = await getReservations({ spaceId })
        
        return data.value || []
      } catch (error: any) {
        this.setError(error.message || 'Error al cargar reservas del espacio')
        return []
      } finally {
        this.setLoading(false)
      }
    },
  },
})
