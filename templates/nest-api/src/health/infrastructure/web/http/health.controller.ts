import { Controller, Get, Inject } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { GetHealthQuery } from '../../../application/queries/get-health/get-health.query.js'
import { presentHealth } from '../../mappers/health.presenter.js'
import { GetHealthResponseDto } from './dtos/responses/get-health-response.dto.js'

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(@Inject(QueryBus) private readonly queries: QueryBus) {}

  @Get()
  @ApiOperation({ operationId: 'getHealth', summary: 'Estado de la API' })
  @ApiOkResponse({ type: GetHealthResponseDto })
  async getHealth(): Promise<GetHealthResponseDto> {
    return presentHealth(await this.queries.execute(new GetHealthQuery()))
  }
}
