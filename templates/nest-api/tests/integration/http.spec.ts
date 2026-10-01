import request from 'supertest'

import { createApplication } from '../../src/create-application'

describe('HTTP contracts', () => {
  it('Should expose health, Swagger and the generated OpenAPI contract', async () => {
    const app = await createApplication()

    try {
      await app.init()
      const health = await request(app.getHttpServer()).get('/health').expect(200)

      expect(health.body).toEqual({ status: 'ok', checkedAt: expect.any(String) })
      const schema = await request(app.getHttpServer()).get('/openapi.json').expect(200)

      expect(schema.body.paths['/health'].get.operationId).toBe('getHealth')
      await request(app.getHttpServer()).get('/docs/').expect(200)
      await request(app.getHttpServer()).get('/missing').expect(404)
    } finally {
      await app.close()
    }
  })
})
