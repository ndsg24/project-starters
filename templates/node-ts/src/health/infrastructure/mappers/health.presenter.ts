import type { HealthReadModel } from '../../domain/read-models/health.read-model.js'
import type { GetHealthResponseDto } from '../web/http/dtos/responses/get-health-response.dto.js'

export function presentHealth(model: HealthReadModel): GetHealthResponseDto {
  return { status: model.status, checkedAt: model.checkedAt.toISOString() }
}
