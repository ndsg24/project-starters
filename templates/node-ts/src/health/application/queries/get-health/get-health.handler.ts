import type { ClockPort } from '../../../domain/ports/output/clock.port.js'
import { GetHealthUseCase } from '../../use-cases/get-health.use-case.js'

export class GetHealthHandler {
  private readonly useCase: GetHealthUseCase
  constructor(clock: ClockPort) {
    this.useCase = new GetHealthUseCase(clock)
  }
  execute() {
    return this.useCase.execute()
  }
}
