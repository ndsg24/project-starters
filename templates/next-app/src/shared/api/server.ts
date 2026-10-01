import 'server-only'
import { createHttpClient } from './lib/http-client'

export function createServerApi() {
  return createHttpClient(process.env.API_URL ?? 'http://localhost:4000')
}
