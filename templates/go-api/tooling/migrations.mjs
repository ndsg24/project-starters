import { mkdirSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const [action, name] = process.argv.slice(2)

if (action === 'create') {
  if (!name || !/^[a-z][a-z0-9_]{0,99}$/.test(name)) {
    throw new Error('Provide a lowercase migration name with underscores')
  }

  mkdirSync('migrations', { recursive: true })
  const prefix = `migrations/${Date.now()}_${name}`

  writeFileSync(`${prefix}.up.sql`, '-- Define schema changes here.\n', { flag: 'wx' })
  writeFileSync(`${prefix}.down.sql`, '-- Define rollback changes here.\n', { flag: 'wx' })
  console.log('Created empty migration files.')
} else {
  if (!['up', 'down'].includes(action)) {
    throw new Error('Use up, down or create')
  }

  const result = spawnSync('go', ['run', './cmd/migrate', action], { stdio: 'inherit' })

  process.exitCode = result.status ?? 1
}
