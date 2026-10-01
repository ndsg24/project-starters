import { Inject } from '@nestjs/common'
import { QueryHandler } from '@nestjs/cqrs'
import { HEALTH_CLOCK } from '../../../domain/enums/tokens/health.tokens.js'
import { GetHealthUseCase } from '../../use-cases/get-health.use-case.js'
import { GetHealthQuery } from './get-health.query.js'
import type { ClockPort } from '../../../domain/ports/output/clock.port.js'
import type { IQueryHandler } from '@nestjs/cqrs'

@QueryHandler(GetHealthQuery)
export class GetHealthHandler implements IQueryHandler<GetHealthQuery> {
  private readonly useCase: GetHealthUseCase

  constructor(@Inject(HEALTH_CLOCK) clock: ClockPort) {
    this.useCase = new GetHealthUseCase(clock)
  }

  async execute() {
    return this.useCase.execute()
  }
}
