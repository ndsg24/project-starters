import type { ClockPort } from '../../domain/ports/output/clock.port.js'
import type { HealthReadModel } from '../../domain/read-models/health.read-model.js'

export class GetHealthUseCase {
  constructor(private readonly clock: ClockPort) {}

  execute(): HealthReadModel {
    return { status: 'ok', checkedAt: this.clock.now() }
  }
}
