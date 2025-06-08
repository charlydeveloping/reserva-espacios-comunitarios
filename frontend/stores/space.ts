import { defineStore } from 'pinia'
import type { Space, CreateSpaceDto, SpaceType } from '~/types'

interface SpaceState {
  spaces: Space[]
  availableSpaces: Space[]
  selectedSpace: Space | null
  loading: boolean
  error: string | null
}

export const useSpaceStore = defineStore('space', {
  state: (): SpaceState => ({
    spaces: [],
    availableSpaces: [],
    selectedSpace: null,
    loading: false,
    error: null,
  }),

  getters: {
    getSpaceById: (state) => (id: string) => {
      return state.spaces.find(space => space.id === id)
    },
    
    getSpacesByType: (state) => (type: SpaceType) => {
      return state.spaces.filter(space => space.tipo === type)
    },
    
    totalSpaces: (state) => state.spaces.length,
    
    spaceTypes: (state) => {
      const types = new Set(state.spaces.map(space => space.tipo))
      return Array.from(types)
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

    // Set selected space
    setSelectedSpace(space: Space | null) {
      this.selectedSpace = space
    },

    // Fetch all spaces
    async fetchSpaces() {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const { getSpaces } = useSpaces()
        const spaces = await getSpaces()
        
        this.spaces = spaces
      } catch (error: any) {
        this.setError(error.message || 'Error al cargar espacios')
      } finally {
        this.setLoading(false)
      }
    },

    // Fetch available spaces
    async fetchAvailableSpaces(date?: string, startTime?: string, endTime?: string) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const { getAvailableSpaces } = useSpaces()
        const availableSpaces = await getAvailableSpaces(date, startTime, endTime)
        
        this.availableSpaces = availableSpaces
      } catch (error: any) {
        this.setError(error.message || 'Error al cargar espacios disponibles')
      } finally {
        this.setLoading(false)
      }
    },

    // Create new space
    async createSpace(spaceData: CreateSpaceDto) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const { createSpace } = useSpaces()
        const newSpace = await createSpace(spaceData)
        
        this.spaces.push(newSpace)
        return newSpace
      } catch (error: any) {
        this.setError(error.message || 'Error al crear espacio')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Fetch space by ID
    async fetchSpace(id: string) {
      try {
        this.setLoading(true)
        this.setError(null)
        
        const { getSpaceById } = useSpaces()
        const space = await getSpaceById(id)
        
        this.setSelectedSpace(space)
        
        // Update in spaces list if exists
        const index = this.spaces.findIndex(space => space.id === id)
        if (index !== -1) {
          this.spaces[index] = space
        }
        
        return space
      } catch (error: any) {
        this.setError(error.message || 'Error al cargar espacio')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Filter spaces by capacity
    filterByCapacity(minCapacity: number) {
      return this.spaces.filter(space => space.capacidad >= minCapacity)
    },

    // Search spaces by name
    searchSpaces(query: string) {
      const lowercaseQuery = query.toLowerCase()
      return this.spaces.filter(space => 
        space.nombre.toLowerCase().includes(lowercaseQuery)
      )
    },

    // Clear error
    clearError() {
      this.setError(null)
    },

    // Clear available spaces
    clearAvailableSpaces() {
      this.availableSpaces = []
    },
  },
})
