import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import architecture from '../conventions/tooling/eslint-boundaries.mjs'

const require = createRequire(new URL('../package.json', import.meta.url))
const { Linter } = require('eslint')
const root = fileURLToPath(new URL('../templates/node-ts/', import.meta.url))

function errors(filename, source) {
  return new Linter().verify(
    source,
    [
      {
        files: ['**/*.js'],
        plugins: { architecture },
        rules: { 'architecture/boundaries': 'error' },
      },
    ],
    { filename: `${root}src/${filename}` },
  )
}

test('Should reject framework and infrastructure dependencies in the pure core', () => {
  assert.equal(
    errors('health/domain/entity.js', "import { Controller } from '@nestjs/common'").length,
    1,
  )

  assert.equal(
    errors(
      'health/application/use-cases/test.js',
      "import { client } from '../../infrastructure/client.js'",
    ).length,
    1,
  )

  assert.equal(
    errors('health/application/use-cases/test.js', "import { Clock } from '../../domain/clock.js'")
      .length,
    0,
  )
})

test('Should enforce lower layers, public APIs and isolated FSD slices', () => {
  assert.equal(errors('shared/ui/button.js', "import { Home } from '@/modules/home'").length, 1)

  assert.equal(
    errors('features/language/control.js', "import { Theme } from '@/features/appearance'").length,
    1,
  )

  assert.equal(
    errors('widgets/settings/control.js', "import { Theme } from '@/features/appearance/ui/theme'")
      .length,
    1,
  )

  assert.equal(
    errors('modules/home/page.js', "import { Settings } from '@/widgets/settings'").length,
    0,
  )
})
