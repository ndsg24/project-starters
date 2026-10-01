import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { mkdir, readFile } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'

import puppeteer from 'puppeteer-core'

const template = process.argv[2]

assert.ok(['react-vite', 'next-app', 'expo-app'].includes(template))
const root = fileURLToPath(new URL('../', import.meta.url))

const directory = resolve(process.env.PROJECT_DIRECTORY ?? resolve(root, 'templates', template))

const port = 3377
const errors = []
let processHandle
let staticServer

if (template === 'expo-app') {
  const assets = resolve(directory, 'dist')

  const mime = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
  }

  staticServer = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)

      const file = resolve(assets, `.${pathname === '/' ? '/index.html' : pathname}`)

      if (!file.startsWith(assets + sep)) {
        response.writeHead(403).end()

        return
      }

      const body = await readFile(file)

      response
        .writeHead(200, {
          'Content-Type': mime[extname(file)] ?? 'application/octet-stream',
        })
        .end(body)
    } catch {
      response.writeHead(404).end()
    }
  })

  await new Promise((done) => staticServer.listen(port, '127.0.0.1', done))
} else {
  const args =
    template === 'react-vite'
      ? ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port)]
      : [
          'node_modules/next/dist/bin/next',
          'start',
          '--hostname',
          '127.0.0.1',
          '--port',
          String(port),
        ]

  processHandle = spawn(process.execPath, args, {
    cwd: directory,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
    stdio: 'inherit',
  })
}

let browser

try {
  let ready = false

  for (let i = 0; i < 100; i++) {
    try {
      ready = (await fetch(`http://127.0.0.1:${port}`)).ok
    } catch {
      /* Wait for startup. */
    }

    if (ready) {
      break
    }

    await delay(100)
  }

  assert.ok(ready, 'Frontend did not start')

  browser = await puppeteer.launch({
    executablePath:
      process.env.BROWSER_EXECUTABLE ??
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox'],
  })

  const page = await browser.newPage()

  page.on('pageerror', (error) => errors.push(error.message))

  await page.setViewport({
    width: template === 'expo-app' ? 393 : 1440,
    height: 900,
    deviceScaleFactor: 1,
  })

  await page.goto(`http://127.0.0.1:${port}`, { waitUntil: 'networkidle0' })
  const native = template === 'expo-app'

  await page.waitForFunction(() =>
    document.body.textContent.includes('Tu próximo proyecto empieza aquí.'),
  )

  const artifacts = resolve(root, 'artifacts', template)

  await mkdir(artifacts, { recursive: true })

  await page.screenshot({
    path: resolve(artifacts, 'dark-es.png'),
    fullPage: true,
  })

  if (native) {
    await page.waitForSelector('[aria-label="English"]:not([aria-disabled="true"])')

    await page.click('[aria-label="English"]')
  } else {
    await page.waitForSelector('select:not([disabled])')
    await page.select('select', 'en')
  }

  await page.waitForFunction(() =>
    document.body.textContent.includes('Your next project starts here.'),
  )

  await page.click('[aria-label="Change theme"]')

  await page.waitForFunction(() =>
    document.querySelector('[aria-label="Change theme"]')?.textContent.includes('Light'),
  )

  for (const width of [1440, 768, 390]) {
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 })

    assert.ok(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      `Horizontal overflow at ${width}px`,
    )

    await page.screenshot({
      path: resolve(artifacts, `light-en-${width}.png`),
      fullPage: true,
    })
  }

  await page.reload({ waitUntil: 'networkidle0' })

  await page.waitForFunction(
    () =>
      document.body.textContent.includes('Your next project starts here.') &&
      document.querySelector('[aria-label="Change theme"]')?.textContent.includes('Light'),
  )

  if (native) {
    await page.click('[aria-label="Português"]')
  } else {
    await page.select('select', 'pt')
  }

  await page.waitForFunction(() =>
    document.body.textContent.includes('Seu próximo projeto começa aqui.'),
  )

  await page.reload({ waitUntil: 'networkidle0' })

  await page.waitForFunction(() =>
    document.body.textContent.includes('Seu próximo projeto começa aqui.'),
  )

  assert.deepEqual(errors, [], 'Browser runtime errors')

  console.log(`${template}: browser theme, three locales, persistence and responsive smoke PASS`)
} finally {
  if (browser) {
    await browser.close()
  }

  if (staticServer) {
    await new Promise((done) => staticServer.close(done))
  }

  if (processHandle?.exitCode === null) {
    processHandle.kill('SIGTERM')

    await Promise.race([new Promise((done) => processHandle.once('exit', done)), delay(5000)])

    if (processHandle.exitCode === null) {
      processHandle.kill('SIGKILL')
    }
  }
}
