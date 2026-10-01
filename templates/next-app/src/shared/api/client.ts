import { createHttpClient } from './lib/http-client'

export const api = createHttpClient(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000')
