import type { Space, CreateSpaceDto, SpaceType } from '~/types'

export const useSpaces = () => {
  const { get, post } = useApi()

  // Get all spaces
  const getSpaces = async (): Promise<Space[]> => {
    return await get<Space[]>('/spaces')
  }

  // Get available spaces
  const getAvailableSpaces = async (date?: string, startTime?: string, endTime?: string): Promise<Space[]> => {
    let endpoint = '/spaces/available'
    const params = new URLSearchParams()
    
    if (date) params.append('date', date)
    if (startTime) params.append('startTime', startTime)
    if (endTime) params.append('endTime', endTime)
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`
    }
    
    return await get<Space[]>(endpoint)
  }

  // Create space
  const createSpace = async (spaceData: CreateSpaceDto): Promise<Space> => {
    return post<Space>('/spaces', spaceData)
  }

  // Get space types for select options
  const getSpaceTypes = (): { value: SpaceType; label: string }[] => {
    return [
      { value: 'sala_reunion', label: 'Sala de Reuniones' },
      { value: 'auditorio', label: 'Auditorio' },
      { value: 'cancha_deportiva', label: 'Cancha Deportiva' },
      { value: 'salon_eventos', label: 'Salón de Eventos' },
      { value: 'laboratorio', label: 'Laboratorio' },
      { value: 'biblioteca', label: 'Biblioteca' },
    ]
  }

  // Get space type label
  const getSpaceTypeLabel = (type: SpaceType): string => {
    const types = getSpaceTypes()
    return types.find(t => t.value === type)?.label || type
  }

  // Get space by ID
  const getSpaceById = async (id: string): Promise<Space> => {
    return await get<Space>(`/spaces/${id}`)
  }

  return {
    getSpaces,
    getAvailableSpaces,
    createSpace,
    getSpaceTypes,
    getSpaceTypeLabel,
    getSpaceById,
  }
}
