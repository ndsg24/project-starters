'use client'

import { AppState, Platform } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { focusManager, onlineManager } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
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

  useEffect(() => {
    if (Platform.OS === 'web') {
      return
    }

    onlineManager.setEventListener((setOnline) =>
      NetInfo.addEventListener((state) =>
        setOnline(state.isConnected !== false && state.isInternetReachable !== false),
      ),
    )

    const subscription = AppState.addEventListener('change', (state) =>
      focusManager.setFocused(state === 'active'),
    )

    return () => {
      subscription.remove()
      onlineManager.setEventListener(() => () => {})
    }
  }, [])

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
