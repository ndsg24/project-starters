import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'

const socket = createServer()
await new Promise((resolve) => socket.listen(0, '127.0.0.1', resolve))
const port = socket.address().port
await new Promise((resolve) => socket.close(resolve))
const api = existsSync('go.mod')
  ? spawn('./bin/api', [], { env: { ...process.env, PORT: String(port) }, stdio: 'inherit' })
  : spawn(process.execPath, ['dist/main.js'], {
      env: { ...process.env, PORT: String(port) },
      stdio: 'inherit',
    })
try {
  let ready = false
  for (let attempt = 0; attempt < 100; attempt++) {
    if (api.exitCode !== null) throw new Error('API exited before becoming ready')
    try {
      ready = (await fetch(`http://127.0.0.1:${port}/health`)).ok
    } catch {
      /* Wait for startup. */
    }
    if (ready) break
    await delay(100)
  }
  if (!ready) throw new Error('API startup timed out')
  const docs = await fetch(`http://127.0.0.1:${port}/docs`)
  if (!docs.ok || !(await docs.text()).includes('<'))
    throw new Error('API documentation is unavailable')
  const runner = spawn(
    process.execPath,
    [
      resolve('node_modules/@usebruno/cli/bin/bru.js'),
      'run',
      '--env',
      'local',
      '--env-var',
      `baseUrl=http://127.0.0.1:${port}`,
    ],
    { cwd: resolve('bruno'), stdio: 'inherit' },
  )
  const code = await new Promise((resolve, reject) => {
    runner.once('error', reject)
    runner.once('exit', resolve)
  })
  if (code !== 0) throw new Error('Bruno contract checks failed')
} finally {
  if (api.exitCode === null) {
    api.kill('SIGTERM')
    await Promise.race([new Promise((resolve) => api.once('exit', resolve)), delay(5000)])
    if (api.exitCode === null) api.kill('SIGKILL')
  }
}
