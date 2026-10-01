import { GetHealthUseCase } from '../../../src/health/application/use-cases/get-health.use-case'

describe('GetHealthUseCase', () => {
  it('Should use the injected clock without framework dependencies', () => {
    const date = new Date('2026-01-01T00:00:00.000Z')
    const result = new GetHealthUseCase({ now: () => date }).execute()
    expect(result).toEqual({ status: 'ok', checkedAt: date })
  })
})
