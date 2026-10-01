import { existsSync, writeFileSync, readFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { spawnSync } from 'node:child_process'

if (!existsSync('.env')) {
  const password = randomBytes(24).toString('hex')

  const contents = readFileSync('.env.example', 'utf8').replaceAll(
    'CHANGE_ME_LOCAL_PASSWORD',
    password,
  )

  writeFileSync('.env', contents, { flag: 'wx', mode: 0o600 })
  console.log('Created .env; existing configuration is never overwritten.')
}

if (
  !process.argv.includes('--env-only') &&
  (existsSync('go.mod') || existsSync('prisma/schema.prisma'))
) {
  const result = spawnSync('docker', ['compose', 'up', '-d', '--wait'], { stdio: 'inherit' })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }

  const check = spawnSync('pnpm', ['db:check'], { stdio: 'inherit' })

  if (check.status !== 0) {
    process.exit(check.status ?? 1)
  }
}
