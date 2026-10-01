import { readConfig } from './platform/config/environment.js'
import { createApplication } from './create-application.js'

async function bootstrap() {
  const { port, host } = readConfig()

  const app = await createApplication()

  await app.listen(port, host)
}

void bootstrap()
