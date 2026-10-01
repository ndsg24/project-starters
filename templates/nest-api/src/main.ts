import { createApplication } from './create-application.js'

async function bootstrap() {
  const port = Number(process.env.PORT ?? 3000)
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT')
  const app = await createApplication()
  await app.listen(port, process.env.HOST ?? '127.0.0.1')
}
void bootstrap()
