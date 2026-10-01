import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client.ts'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required. Run pnpm run setup.')
}

const client = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 5000,
    max: 2,
  }),
})

try {
  const rows = await client.$queryRaw`SELECT 1 AS connected`

  if (rows[0]?.connected !== 1) {
    throw new Error('Unexpected database response')
  }

  console.log('Prisma/PostgreSQL connection PASS; no business tables or records created.')
} finally {
  await client.$disconnect()
}
