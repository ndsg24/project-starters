import { presentHealth } from '../../mappers/health.presenter.js'

import type { FastifyInstance } from 'fastify'
import type { GetHealthHandler } from '../../../application/queries/get-health/get-health.handler.js'

export function registerHealthController(server: FastifyInstance, handler: GetHealthHandler): void {
  server.get(
    '/health',
    {
      schema: {
        operationId: 'getHealth',
        tags: ['health'],
        summary: 'Estado de la API',
        response: {
          200: {
            type: 'object',
            required: ['status', 'checkedAt'],
            additionalProperties: false,
            properties: {
              status: { type: 'string', enum: ['ok'] },
              checkedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    () => presentHealth(handler.execute()),
  )
}
