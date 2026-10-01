import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'

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

export interface HttpOptions<T = unknown>
  extends Pick<AxiosRequestConfig, 'method' | 'headers' | 'params' | 'signal' | 'withCredentials'> {
  body?: unknown
  timeoutMs?: number
  decode?: (value: unknown) => T
}

export class HttpClient {
  private readonly base: URL

  private readonly instance: AxiosInstance

  constructor(
    baseUrl: string,
    private readonly defaultTimeoutMs = 15000,
  ) {
    this.base = new URL(baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`)

    if (
      !['http:', 'https:'].includes(this.base.protocol) ||
      this.base.username ||
      this.base.password
    ) {
      throw new Error('API URL must be an HTTP URL without credentials')
    }

    this.validateTimeout(defaultTimeoutMs)

    this.instance = axios.create({
      baseURL: this.base.toString(),
      timeout: defaultTimeoutMs,
      headers: { Accept: 'application/json' },
      responseType: 'json',
      transitional: { silentJSONParsing: false, clarifyTimeoutError: true },
      maxRedirects: 0,
    })
  }

  async request<T = unknown>(path: string, options: HttpOptions<T> = {}): Promise<T> {
    const url = new URL(path.replace(/^\/+/, ''), this.base)

    if (
      url.origin !== this.base.origin ||
      !url.pathname.startsWith(this.base.pathname) ||
      url.username ||
      url.password
    ) {
      throw new Error('Request path must stay within the configured API')
    }

    const { body, timeoutMs = this.defaultTimeoutMs, decode, ...config } = options

    this.validateTimeout(timeoutMs)

    try {
      const response = await this.instance.request<unknown>({
        ...config,
        url: url.toString(),
        data: body,
        timeout: timeoutMs,
      })

      const value = response.status === 204 || response.data === '' ? undefined : response.data

      if (decode) {
        try {
          return decode(value)
        } catch {
          throw new ApiError('response', 'API response failed validation', response.status)
        }
      }

      return value as T
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      if (axios.isCancel(error)) {
        throw new ApiError('cancelled', 'Request cancelled')
      }

      if (axios.isAxiosError(error)) {
        if (error.code === AxiosError.ETIMEDOUT || error.code === AxiosError.ECONNABORTED) {
          throw new ApiError('timeout', 'Request timed out')
        }

        if (error.cause instanceof SyntaxError) {
          throw new ApiError('response', 'API returned invalid JSON', error.response?.status)
        }

        if (error.response) {
          throw new ApiError(
            'http',
            `HTTP ${error.response.status}`,
            error.response.status,
            error.response.data,
          )
        }
      }

      throw new ApiError('network', 'API request failed')
    }
  }

  get<T = unknown>(path: string, options: HttpOptions<T> = {}): Promise<T> {
    return this.request(path, { ...options, method: 'GET' })
  }

  post<T = unknown>(path: string, body?: unknown, options: HttpOptions<T> = {}): Promise<T> {
    return this.request(path, { ...options, body, method: 'POST' })
  }

  put<T = unknown>(path: string, body?: unknown, options: HttpOptions<T> = {}): Promise<T> {
    return this.request(path, { ...options, body, method: 'PUT' })
  }

  patch<T = unknown>(path: string, body?: unknown, options: HttpOptions<T> = {}): Promise<T> {
    return this.request(path, { ...options, body, method: 'PATCH' })
  }

  delete<T = unknown>(path: string, options: HttpOptions<T> = {}): Promise<T> {
    return this.request(path, { ...options, method: 'DELETE' })
  }

  private validateTimeout(timeoutMs: number): void {
    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
      throw new Error('HTTP timeout must be positive')
    }
  }
}
