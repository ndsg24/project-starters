/** @jest-environment node */
import { ApiError, createHttpClient } from '../../src/shared/api/lib/http-client'

const originalFetch = globalThis.fetch
const fetchMock = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()

beforeEach(() => {
  fetchMock.mockReset()
  globalThis.fetch = fetchMock
})

afterAll(() => {
  globalThis.fetch = originalFetch
})

it('Should send JSON to the configured API without losing headers', async () => {
  fetchMock.mockResolvedValue(
    new Response('{"ok":true}', { headers: { 'content-type': 'application/json' } }),
  )

  const client = createHttpClient('https://api.test/v1')

  await expect(
    client.request('resource', {
      method: 'POST',
      body: { value: 1 },
      headers: { 'X-Request-ID': 'test' },
    }),
  ).resolves.toEqual({ ok: true })

  const [url, init] = fetchMock.mock.calls[0]!

  expect(url).toBe('https://api.test/v1/resource')
  expect(new Headers(init?.headers).get('X-Request-ID')).toBe('test')
  expect(init?.body).toBe('{"value":1}')
})

it('Should reject cross-origin and escaping paths before sending a request', async () => {
  const client = createHttpClient('https://api.test/v1')

  await expect(client.request('https://other.test')).rejects.toThrow()
  await expect(client.request('../private')).rejects.toThrow()
  expect(fetchMock).not.toHaveBeenCalled()
})

it('Should normalize HTTP errors and tolerate an empty successful response', async () => {
  const client = createHttpClient('https://api.test')

  fetchMock.mockResolvedValueOnce(
    new Response('{"code":"invalid"}', {
      status: 422,
      headers: { 'content-type': 'application/json' },
    }),
  )

  await expect(client.request('resource')).rejects.toMatchObject({ kind: 'http', status: 422 })
  fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))
  await expect(client.request('resource')).resolves.toBeUndefined()
})

it('Should normalize network errors and invalid JSON', async () => {
  const client = createHttpClient('https://api.test')

  fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'))
  await expect(client.request('resource')).rejects.toBeInstanceOf(ApiError)

  fetchMock.mockResolvedValueOnce(
    new Response('{', { headers: { 'content-type': 'application/json' } }),
  )

  await expect(client.request('resource')).rejects.toMatchObject({ kind: 'response' })
})

it('Should abort requests on timeout and distinguish user cancellation', async () => {
  fetchMock.mockImplementation(
    (_url, init) =>
      new Promise((_resolve, reject) => {
        const abort = () => reject(new Error('aborted'))

        if (init?.signal?.aborted) {
          abort()
        } else {
          init?.signal?.addEventListener('abort', abort, { once: true })
        }
      }),
  )

  const client = createHttpClient('https://api.test', 10)

  await expect(client.request('resource')).rejects.toMatchObject({ kind: 'timeout' })
  const controller = new AbortController()

  controller.abort()

  await expect(client.request('resource', { signal: controller.signal })).rejects.toMatchObject({
    kind: 'cancelled',
  })
})
