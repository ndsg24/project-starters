export type ApiErrorKind = 'http' | 'network' | 'timeout' | 'cancelled' | 'response'

export class ApiError extends Error {
  constructor(
    public readonly kind: ApiErrorKind,
    message: string,
    public readonly status?: number,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface HttpOptions<T> extends Omit<RequestInit, 'body'> {
  body?: unknown
  timeoutMs?: number
  decode?: (value: unknown) => T
}

export function createHttpClient(baseUrl: string, defaultTimeoutMs = 15000) {
  const base = new URL(baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`)

  if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password) {
    throw new Error('API URL must be an HTTP URL without credentials')
  }

  if (!Number.isFinite(defaultTimeoutMs) || defaultTimeoutMs <= 0) {
    throw new Error('HTTP timeout must be positive')
  }

  return {
    async request<T = unknown>(path: string, options: HttpOptions<T> = {}): Promise<T> {
      const url = new URL(path.replace(/^\/+/, ''), base)

      if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) {
        throw new Error('Request path must stay within the configured API')
      }

      const { body, signal, timeoutMs = defaultTimeoutMs, decode, ...init } = options

      if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
        throw new Error('HTTP timeout must be positive')
      }

      const controller = new AbortController()
      const cancel = () => controller.abort()
      let timedOut = false

      const timer = setTimeout(() => {
        timedOut = true
        controller.abort()
      }, timeoutMs)

      signal?.addEventListener('abort', cancel, { once: true })

      if (signal?.aborted) {
        controller.abort()
      }

      try {
        const headers = new Headers(init.headers)

        headers.set('Accept', 'application/json')

        if (body !== undefined) {
          headers.set('Content-Type', 'application/json')
        }

        const response = await fetch(url.toString(), {
          ...init,
          headers,
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal,
        })

        const text = await response.text()
        let value: unknown = undefined

        if (text) {
          if (response.headers.get('content-type')?.includes('json')) {
            try {
              value = JSON.parse(text)
            } catch {
              throw new ApiError('response', 'API returned invalid JSON', response.status)
            }
          } else {
            value = text
          }
        }

        if (!response.ok) {
          throw new ApiError('http', `HTTP ${response.status}`, response.status, value)
        }

        return decode ? decode(value) : (value as T)
      } catch (error) {
        if (error instanceof ApiError) {
          throw error
        }

        if (controller.signal.aborted) {
          throw new ApiError(
            timedOut ? 'timeout' : 'cancelled',
            timedOut ? 'Request timed out' : 'Request cancelled',
          )
        }

        throw new ApiError('network', 'API request failed')
      } finally {
        clearTimeout(timer)
        signal?.removeEventListener('abort', cancel)
      }
    },
  }
}
