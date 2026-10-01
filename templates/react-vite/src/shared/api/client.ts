import { createHttpClient } from './lib/http-client'

export const api = createHttpClient(import.meta.env.VITE_API_URL ?? 'http://localhost:4000')
