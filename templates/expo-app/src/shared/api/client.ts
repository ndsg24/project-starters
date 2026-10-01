import { createHttpClient } from './lib/http-client'

export const api = createHttpClient(process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000')
