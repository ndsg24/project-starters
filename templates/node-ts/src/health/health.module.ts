import type { FastifyInstance } from 'fastify'
import { GetHealthHandler } from './application/queries/get-health/get-health.handler.js'
import type { ClockPort } from './domain/ports/output/clock.port.js'
import { SystemClockAdapter } from './infrastructure/adapters/system-clock.adapter.js'
import { registerHealthController } from './infrastructure/web/http/health.controller.js'

export function registerHealth(
  server: FastifyInstance,
  clock: ClockPort = new SystemClockAdapter(),
): void {
  registerHealthController(server, new GetHealthHandler(clock))
}
