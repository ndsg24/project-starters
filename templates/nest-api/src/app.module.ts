import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { HealthModule } from './health/index.js'

@Module({ imports: [CqrsModule.forRoot(), HealthModule] })
export class AppModule {}
