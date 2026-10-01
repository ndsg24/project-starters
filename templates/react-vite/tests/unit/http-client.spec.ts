/** @jest-environment node */
import { createServer, type Server } from 'node:http'
import { type AddressInfo } from 'node:net'
import { ApiError, HttpClient } from '../../src/shared/api/lib/http-client'

let server: Server
let baseUrl: string
let receivedRequests = 0

beforeAll(async () => {
  server = createServer(async (request, response) => {
    receivedRequests += 1
    const url = new URL(request.url ?? '/', 'http://localhost')

    response.setHeader('Content-Type', 'application/json')

    if (url.pathname === '/v1/error') {
      response.writeHead(422).end('{"code":"invalid"}')

      return
    }

    if (url.pathname === '/v1/empty') {
      response.writeHead(204).end()

      return
    }

    if (url.pathname === '/v1/invalid') {
      response.end('{')

      return
    }

    if (url.pathname === '/v1/network') {
      request.socket.destroy()

      return
    }

    if (url.pathname === '/v1/slow') {
      const timer = setTimeout(() => response.end('{}'), 200)

      response.on('close', () => clearTimeout(timer))

      return
    }

    const chunks: Buffer[] = []

    for await (const chunk of request) {
      chunks.push(Buffer.from(chunk))
    }

    const body = Buffer.concat(chunks).toString()

    response.end(
      JSON.stringify({
        method: request.method,
        path: url.pathname,
        query: url.searchParams.get('search'),
        requestId: request.headers['x-request-id'],
        contentType: request.headers['content-type'],
        body: body ? JSON.parse(body) : undefined,
      }),
    )
  })

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}/v1`
})

afterAll(async () => {
  server.closeAllConnections()

  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  )
})

it('Should use Axios to serialize JSON, headers and query parameters', async () => {
  const client = new HttpClient(baseUrl)

  await expect(
    client.post(
      'resource',
      { value: 1 },
      {
        headers: { 'X-Request-ID': 'test' },
        params: { search: 'a b' },
      },
    ),
  ).resolves.toMatchObject({
    method: 'POST',
    path: '/v1/resource',
    query: 'a b',
    requestId: 'test',
    contentType: 'application/json',
    body: { value: 1 },
  })
})

it.each(['get', 'put', 'patch', 'delete'] as const)('Should send the %s method', async (method) => {
  const client = new HttpClient(baseUrl)

  await expect(client[method]('resource')).resolves.toMatchObject({ method: method.toUpperCase() })
})

it('Should reject unsafe paths and invalid configuration before sending', async () => {
  const client = new HttpClient(baseUrl)
  const previousCount = receivedRequests

  await expect(client.get('https://other.test')).rejects.toThrow()
  await expect(client.get('../private')).rejects.toThrow()
  await expect(client.get('resource', { timeoutMs: 0 })).rejects.toThrow()
  expect(() => new HttpClient('ftp://api.test')).toThrow()
  expect(() => new HttpClient('https://user:password@api.test')).toThrow()
  expect(() => new HttpClient(baseUrl, -1)).toThrow()
  expect(receivedRequests).toBe(previousCount)
})

it('Should normalize HTTP errors and empty responses', async () => {
  const client = new HttpClient(baseUrl)

  await expect(client.get('error')).rejects.toMatchObject({
    kind: 'http',
    status: 422,
    details: { code: 'invalid' },
  })

  await expect(client.get('empty')).resolves.toBeUndefined()
})

it('Should normalize network errors and invalid JSON', async () => {
  const client = new HttpClient(baseUrl)

  await expect(client.get('network')).rejects.toBeInstanceOf(ApiError)
  await expect(client.get('network')).rejects.toMatchObject({ kind: 'network' })
  await expect(client.get('invalid')).rejects.toMatchObject({ kind: 'response' })
})

it('Should distinguish timeouts from cancellation before and during requests', async () => {
  const client = new HttpClient(baseUrl, 30)

  await expect(client.get('slow')).rejects.toMatchObject({ kind: 'timeout' })
  const cancelled = new AbortController()

  cancelled.abort()

  await expect(client.get('resource', { signal: cancelled.signal })).rejects.toMatchObject({
    kind: 'cancelled',
  })

  const controller = new AbortController()
  const pending = client.get('slow', { signal: controller.signal, timeoutMs: 1000 })

  setTimeout(() => controller.abort(), 20)
  await expect(pending).rejects.toMatchObject({ kind: 'cancelled' })
})

it('Should decode responses and report decoder failures as response errors', async () => {
  const client = new HttpClient(baseUrl)

  await expect(
    client.get('resource', { decode: (value) => (value as { method: string }).method }),
  ).resolves.toBe('GET')

  await expect(
    client.get('resource', {
      decode: () => {
        throw new Error('Invalid payload')
      },
    }),
  ).rejects.toMatchObject({ kind: 'response' })
})
