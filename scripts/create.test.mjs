import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { create, templates } from './create.mjs'

test('all templates are standalone, renamed, and omit generated files', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'starters-'))

  try {
    for (const template of templates) {
      const target = join(temporary, `test-${template}`)

      await create(template, target)
      await stat(join(target, 'LICENSE'))

      if (template === 'expo-app') {
        assert.match(await readFile(join(target, 'LICENSE'), 'utf8'), /650 Industries/)
      }

      const pkg = JSON.parse(await readFile(join(target, 'package.json'), 'utf8'))

      assert.equal(pkg.name, `test-${template}`)
      await stat(join(target, 'pnpm-lock.yaml'))
      await stat(join(target, '.husky/pre-commit'))
      await stat(join(target, 'eslint.config.mjs'))

      if (template === 'go-api') {
        assert.match(await readFile(join(target, 'go.mod'), 'utf8'), /example.com\/test-go-api/)

        assert.match(
          await readFile(join(target, 'internal/server/server.go'), 'utf8'),
          /example.com\/test-go-api/,
        )
      }

      for (const excluded of [
        'node_modules',
        '.git',
        '.next',
        '.expo',
        'bin',
        'dist',
        'src/generated',
        'dist-native',
        'artifacts',
        '.husky/_',
        '.env',
      ]) {
        await assert.rejects(stat(join(target, excluded)), { code: 'ENOENT' })
      }

      await assert.rejects(create(template, target), /already exists/)
    }

    await assert.rejects(create('../bad', join(temporary, 'bad')), /Unknown template/)

    await assert.rejects(create('node-ts', join(temporary, 'bad name')), /lowercase/)
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
})
