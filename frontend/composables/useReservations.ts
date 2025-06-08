import type { Reservation, CreateReservationDto, ReservationStatus } from '~/types'

export const useReservations = () => {
  const { get, post, put } = useApi()

  // Get all reservations
  const getReservations = (filters?: {
    userId?: string
    spaceId?: string
    status?: ReservationStatus
    startDate?: string
    endDate?: string
  }) => {
    let endpoint = '/reservations'
    
    if (filters) {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`
      }
    }
    
    return get<Reservation[]>(endpoint)
  }

  // Get reservation by ID
  const getReservationById = (id: string) => {
    return get<Reservation>(`/reservations/${id}`)
  }

  // Create reservation
  const createReservation = async (reservationData: CreateReservationDto): Promise<Reservation> => {
    return post<Reservation>('/reservations', reservationData)
  }

  // Cancel reservation
  const cancelReservation = async (id: string): Promise<Reservation> => {
    return put<Reservation>(`/reservations/${id}/cancel`, {})
  }

  // Get user reservations
  const getUserReservations = (userId: string) => {
    return getReservations({ userId })
  }

  // Get reservation status options
  const getReservationStatusOptions = (): { value: ReservationStatus; label: string; color: string }[] => {
    return [
      { value: 'PENDING', label: 'Pendiente', color: 'warning' },
      { value: 'CONFIRMED', label: 'Confirmada', color: 'success' },
      { value: 'CANCELLED', label: 'Cancelada', color: 'error' },
    ]
  }

  // Get status label and color
  const getReservationStatusInfo = (status: ReservationStatus) => {
    const options = getReservationStatusOptions()
    return options.find(option => option.value === status) || { 
      value: status, 
      label: status, 
      color: 'info' 
    }
  }

  // Format date and time
  const formatReservationDateTime = (date: string, startTime: string, endTime: string) => {
    const reservationDate = new Date(date)
    const startDateTime = new Date(startTime)
    const endDateTime = new Date(endTime)
    
    return {
      date: reservationDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      startTime: startDateTime.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      endTime: endDateTime.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      duration: Math.round((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60 * 100)) / 10
    }
  }

  return {
    getReservations,
    getReservationById,
    createReservation,
    cancelReservation,
    getUserReservations,
    getReservationStatusOptions,
    getReservationStatusInfo,
    formatReservationDateTime,
  }
}
