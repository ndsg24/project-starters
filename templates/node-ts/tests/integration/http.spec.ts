import { createServer } from '../../src/server'

describe('HTTP contracts', () => {
  it('Should expose health and its generated OpenAPI contract', async () => {
    const server = await createServer()

    try {
      const health = await server.inject('/health')

      expect(health.statusCode).toBe(200)
      expect(health.json()).toEqual({ status: 'ok', checkedAt: expect.any(String) })
      const schema = await server.inject('/openapi.json')

      expect(schema.json().paths['/health'].get.operationId).toBe('getHealth')
      expect((await server.inject('/missing')).statusCode).toBe(404)
    } finally {
      await server.close()
    }
  })
})
