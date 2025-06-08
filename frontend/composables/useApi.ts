import type { ApiResponse, ApiError } from '~/types'

interface UseApiOptions {
  immediate?: boolean
  server?: boolean
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const request = async <T>(
    endpoint: string,
    options: any = {}
  ): Promise<T> => {
    try {
      const response = await $fetch<T>(`${apiBase}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })
      return response
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.message || 'An error occurred',
        code: error.statusCode?.toString(),
        details: error.data
      }
      throw apiError
    }
  }

  const get = <T>(endpoint: string, options?: UseApiOptions) => {
    return useLazyAsyncData<T>(
      endpoint,
      () => request<T>(endpoint),
      {
        immediate: options?.immediate ?? true,
        server: options?.server ?? true,
      }
    )
  }

  const post = async <T>(endpoint: string, body: any): Promise<T> => {
    return request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  const put = async <T>(endpoint: string, body: any): Promise<T> => {
    return request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  const del = async <T>(endpoint: string): Promise<T> => {
    return request<T>(endpoint, {
      method: 'DELETE',
    })
  }

  return {
    request,
    get,
    post,
    put,
    delete: del,
  }
}
