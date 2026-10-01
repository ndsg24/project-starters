import { Injectable } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { readConfig } from '../config/environment.js'
import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common'

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const { databaseUrl } = readConfig()

    super({
      adapter: new PrismaPg({
        connectionString: databaseUrl,
        max: 10,
        connectionTimeoutMillis: 5000,
      }),
    })
  }

  async onModuleInit() {
    await this.$connect()
    await this.$queryRaw`SELECT 1`
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
