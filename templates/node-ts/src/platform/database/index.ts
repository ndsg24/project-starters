import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

export async function connectDatabase(connectionString: string) {
  const client = new PrismaClient({
    adapter: new PrismaPg({ connectionString, max: 10, connectionTimeoutMillis: 5000 }),
  })

  try {
    await client.$connect()
    await client.$queryRaw`SELECT 1`
  } catch (error) {
    await client.$disconnect()

    throw error
  }

  return client
}

export type Database = PrismaClient
