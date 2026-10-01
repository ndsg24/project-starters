import type { ClockPort } from '../../domain/ports/output/clock.port.js'

export class SystemClockAdapter implements ClockPort {
  now(): Date {
    return new Date()
  }
}
