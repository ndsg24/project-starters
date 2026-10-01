import { connectDatabase } from './platform/database/index.js'
import { readConfig } from './platform/config/environment.js'
import { createServer } from './server.js'

const { port, host, databaseUrl, corsOrigins } = readConfig()
const database = await connectDatabase(databaseUrl)
const server = await createServer({ database, corsOrigins })

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void server.close().catch(() => {
      process.exitCode = 1
    })
  })
}

try {
  await server.listen({ port, host })
} catch (error) {
  await server.close()

  throw error
}
