import { HttpClient } from './lib/http-client'

export const api = new HttpClient(import.meta.env.VITE_API_URL ?? 'http://localhost:4000')
