import 'server-only'
import { createHttpClient } from '../api'

export function createServerApi() {
  return createHttpClient(process.env.API_URL ?? 'http://localhost:4000')
}
