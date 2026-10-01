import 'server-only'
import { HttpClient } from '../api'

export function createServerApi() {
  return new HttpClient(process.env.API_URL ?? 'http://localhost:4000')
}
