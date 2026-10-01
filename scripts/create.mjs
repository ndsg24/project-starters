#!/usr/bin/env node
import { cp, mkdir, readFile, writeFile, stat, readdir } from 'node:fs/promises'
import { resolve, basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

export const templates = ['go-api', 'node-ts', 'nest-api', 'react-vite', 'next-app', 'expo-app']
const root = fileURLToPath(new URL('../', import.meta.url))

const ignored = new Set([
  'node_modules',
  '.git',
  '.next',
  '.expo',
  'dist',
  'dist-native',
  'artifacts',
  'build',
  'bin',
  'coverage',
  'out',
  'web-build',
])

export async function create(template, destination) {
  if (!templates.includes(template)) {
    throw new Error(`Unknown template. Choose: ${templates.join(', ')}`)
  }

  const target = resolve(destination)
  const name = basename(target)

  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    throw new Error(
      'Use a lowercase project name starting with a letter (letters, numbers, hyphens).',
    )
  }

  try {
    await stat(target)

    throw new Error('Destination already exists. Choose a new directory.')
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
  }

  await mkdir(target, { recursive: true })

  await cp(join(root, 'templates', template), target, {
    recursive: true,
    filter: (source) => {
      const part = basename(source)

      return (
        !source.includes('/.husky/_') &&
        !ignored.has(part) &&
        !part.endsWith('.tsbuildinfo') &&
        (!part.startsWith('.env') || part === '.env.example')
      )
    },
  })

  const manifest = join(target, 'package.json')
  const data = JSON.parse(await readFile(manifest, 'utf8'))

  data.name = name
  await writeFile(manifest, JSON.stringify(data, null, 2) + '\n')

  if (template === 'go-api') {
    async function renameModules(directory) {
      for (const entry of await readdir(directory, { withFileTypes: true })) {
        const file = join(directory, entry.name)

        if (entry.isDirectory()) {
          await renameModules(file)
        } else if (entry.name.endsWith('.go') || entry.name === 'go.mod') {
          await writeFile(
            file,
            (await readFile(file, 'utf8')).replaceAll('example.com/go-api', `example.com/${name}`),
          )
        }
      }
    }

    await renameModules(target)
  } else {
    if (template === 'expo-app') {
      const path = join(target, 'app.json')
      const data = JSON.parse(await readFile(path, 'utf8'))

      data.expo.name = name
      data.expo.slug = name
      data.expo.scheme = name
      await writeFile(path, JSON.stringify(data, null, 2) + '\n')
    }
  }

  try {
    await stat(join(target, 'LICENSE'))
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }

    await cp(join(root, 'LICENSE'), join(target, 'LICENSE'))
  }

  return target
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { values, positionals } = parseArgs({
      allowPositionals: true,
      options: {
        list: { type: 'boolean' },
        help: { type: 'boolean', short: 'h' },
      },
    })

    if (values.list) {
      console.log(templates.join('\n'))
    } else if (values.help || positionals.length !== 2) {
      console.log(
        'Usage: pnpm run create -- <template> <destination>\n       pnpm run create -- --list',
      )

      if (!values.help) {
        process.exitCode = 1
      }
    } else {
      const target = await create(...positionals)

      console.log(
        `Created ${target}\nNext: cd ${JSON.stringify(target)}\npnpm install && pnpm dev\nAfter git init, run pnpm prepare to activate hooks\nInitialize Git when ready: git init`,
      )
    }
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
