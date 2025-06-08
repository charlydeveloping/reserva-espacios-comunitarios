import type { User, CreateUserDto, UpdateUserDto } from '~/types'

export const useUsers = () => {
  const { get, post, put } = useApi()

  // Get all users
  const getUsers = () => {
    return get<User[]>('/users')
  }

  // Get user by ID
  const getUserById = (id: string) => {
    return get<User>(`/users/${id}`)
  }

  // Create user
  const createUser = async (userData: CreateUserDto): Promise<User> => {
    return post<User>('/users', userData)
  }

  // Update user
  const updateUser = async (id: string, userData: UpdateUserDto): Promise<User> => {
    return put<User>(`/users/${id}`, userData)
  }

  // Search users by name
  const searchUsersByName = (name: string) => {
    return get<User[]>(`/users?name=${encodeURIComponent(name)}`)
  }

  return {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    searchUsersByName,
  }
}
