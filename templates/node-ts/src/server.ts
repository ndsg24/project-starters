import cors from '@fastify/cors'
import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { registerHealth } from './health/index.js'
import type { Database } from './platform/database/index.js'

export async function createServer(options: { database?: Database; corsOrigins?: string[] } = {}) {
  const server = Fastify({ logger: true, bodyLimit: 1024 * 1024 })

  await server.register(cors, { origin: options.corsOrigins ?? [] })

  if (options.database) {
    server.decorate('database', options.database)

    server.addHook('onClose', async () => {
      await options.database?.$disconnect()
    })
  }

  await server.register(swagger, { openapi: { info: { title: 'Node API', version: '1.0.0' } } })
  await server.register(swaggerUi, { routePrefix: '/docs' })
  registerHealth(server)
  server.get('/openapi.json', { schema: { hide: true } }, () => server.swagger())

  return server
}

declare module 'fastify' {
  interface FastifyInstance {
    database?: Database
  }
}
