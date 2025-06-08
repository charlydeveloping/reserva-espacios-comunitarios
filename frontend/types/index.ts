// User types
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role?: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

export interface CreateUserDto {
  name: string
  email: string
  password: string
  phone?: string
  role?: 'admin' | 'user'
}

export interface UpdateUserDto {
  name?: string
  email?: string
  phone?: string
  role?: 'admin' | 'user'
}

// Space types
export interface Space {
  id: string
  name: string
  type: SpaceType
  capacity: number
  description?: string
  location?: string
  amenities?: string[]
  available?: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSpaceDto {
  name: string
  type: SpaceType
  capacity: number
  description?: string
  location?: string
  amenities?: string[]
}

export type SpaceType = 
  | 'sala_reunion'
  | 'auditorio'
  | 'cancha_deportiva'
  | 'salon_eventos'
  | 'laboratorio'
  | 'biblioteca'

// Reservation types
export interface Reservation {
  id: string
  userId: string
  spaceId: string
  date: string
  startTime: string
  endTime: string
  status: ReservationStatus
  purpose?: string
  attendees?: number
  specialRequirements?: string
  contactPhone?: string
  createdAt: string
  updatedAt: string
  user?: User
  space?: Space
}

export interface CreateReservationDto {
  userId: string
  spaceId: string
  date: string
  startTime: string
  endTime: string
  purpose?: string
  attendees?: number
  specialRequirements?: string
  contactPhone?: string
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

// Notification types
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  subject: string
  content: string
  status: NotificationStatus
  read?: boolean
  readAt?: string
  title?: string
  message?: string
  reservationId?: string
  sentAt?: string
  createdAt: string
  updatedAt: string
  user?: User
}

export interface CreateNotificationDto {
  userId: string
  type: NotificationType
  subject: string
  content: string
}

export type NotificationType = 
  | 'RESERVATION_CONFIRMED'
  | 'RESERVATION_CANCELLED'
  | 'RESERVATION_REMINDER'
  | 'SYSTEM'

export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED'

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface FilterOptions {
  startDate?: string
  endDate?: string
  spaceType?: SpaceType
  status?: ReservationStatus
  userId?: string
  spaceId?: string
}

// UI types
export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
}

export interface BreadcrumbItem {
  label: string
  to?: string
  active?: boolean
}

// Error types
export interface ApiError {
  message: string
  code?: string
  details?: Record<string, any>
}

export interface FormError {
  field: string
  message: string
}

// Store types
export interface UserState {
  currentUser: User | null
  users: User[]
  loading: boolean
  error: string | null
}

export interface SpaceState {
  spaces: Space[]
  selectedSpace: Space | null
  loading: boolean
  error: string | null
}

export interface ReservationState {
  reservations: Reservation[]
  userReservations: Reservation[]
  selectedReservation: Reservation | null
  loading: boolean
  error: string | null
}

export interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
}
