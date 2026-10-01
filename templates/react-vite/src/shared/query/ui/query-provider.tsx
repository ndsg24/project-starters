'use client'

import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '../lib/create-query-client'
import type { ReactNode } from 'react'

let browserClient: ReturnType<typeof createQueryClient> | undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    return createQueryClient()
  }

  browserClient ??= createQueryClient()

  return browserClient
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(getQueryClient)

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
