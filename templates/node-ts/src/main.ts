import { createServer } from './server.js'

const port = Number(process.env.PORT ?? 3000)

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('Invalid PORT')
}

const server = await createServer()

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void server.close().catch(() => {
      process.exitCode = 1
    })
  })
}

await server.listen({ port, host: process.env.HOST ?? '127.0.0.1' })
