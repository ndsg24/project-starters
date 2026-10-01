import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '../../api'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30000,
        gcTime: 300000,
        retry: (failureCount, error) =>
          failureCount < 2 &&
          !(
            error instanceof ApiError &&
            (error.kind === 'cancelled' || (error.kind === 'http' && (error.status ?? 0) < 500))
          ),
        refetchOnWindowFocus: true,
      },
      mutations: { retry: false },
    },
  })
}
