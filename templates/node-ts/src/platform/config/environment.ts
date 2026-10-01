import 'dotenv/config'

export function readConfig() {
  const databaseUrl = process.env.DATABASE_URL
  const port = Number(process.env.PORT ?? 4000)

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required. Run pnpm run setup.')
  }

  let parsed: URL

  try {
    parsed = new URL(databaseUrl)
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL URL')
  }

  if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) {
    throw new Error('DATABASE_URL must use PostgreSQL')
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be between 1 and 65535')
  }

  const corsOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  for (const origin of corsOrigins) {
    const url = new URL(origin)

    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) {
      throw new Error('CORS_ORIGINS must contain explicit HTTP origins')
    }
  }

  return { databaseUrl, port, host: process.env.HOST ?? '127.0.0.1', corsOrigins }
}
