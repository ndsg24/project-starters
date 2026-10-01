import { spawnSync } from 'node:child_process'

const result = spawnSync('gofmt', ['-l', 'cmd', 'internal'], { encoding: 'utf8' })

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}

if (result.stdout.trim()) {
  console.error(result.stdout)
  process.exit(1)
}
