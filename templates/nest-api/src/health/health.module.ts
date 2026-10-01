import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { GetHealthHandler } from './application/queries/get-health/get-health.handler.js'
import { HEALTH_CLOCK } from './domain/enums/tokens/health.tokens.js'
import { SystemClockAdapter } from './infrastructure/adapters/system-clock.adapter.js'
import { HealthController } from './infrastructure/web/http/health.controller.js'

@Module({
  imports: [CqrsModule],
  controllers: [HealthController],
  providers: [GetHealthHandler, { provide: HEALTH_CLOCK, useClass: SystemClockAdapter }],
})
export class HealthModule {}
