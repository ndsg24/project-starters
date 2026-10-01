import { Query } from '@nestjs/cqrs'
import type { HealthReadModel } from '../../../domain/read-models/health.read-model.js'

export class GetHealthQuery extends Query<HealthReadModel> {}
