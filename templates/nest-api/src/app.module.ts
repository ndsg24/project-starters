import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DatabaseModule } from './platform/database/database.module.js'
import { HealthModule } from './health/index.js'

@Module({ imports: [CqrsModule.forRoot(), DatabaseModule, HealthModule] })
export class AppModule {}
