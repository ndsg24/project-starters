import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { registerHealth } from './health/index.js'

export async function createServer() {
  const server = Fastify({ logger: true, bodyLimit: 1024 * 1024 })
  await server.register(swagger, { openapi: { info: { title: 'Node API', version: '1.0.0' } } })
  await server.register(swaggerUi, { routePrefix: '/docs' })
  registerHealth(server)
  server.get('/openapi.json', { schema: { hide: true } }, () => server.swagger())
  return server
}
