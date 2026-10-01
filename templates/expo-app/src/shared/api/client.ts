import { HttpClient } from './lib/http-client'

export const api = new HttpClient(process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000')
