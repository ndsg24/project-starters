import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

// A template inside the catalog must never change the catalog's Git hooks.
if (process.env.CI !== 'true' && process.env.HUSKY !== '0' && existsSync('.git')) {
  const result = spawnSync(process.execPath, ['node_modules/husky/bin.js'], { stdio: 'inherit' })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}
