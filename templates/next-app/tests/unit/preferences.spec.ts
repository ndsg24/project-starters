import {
  defaultPreferences,
  parsePreferences,
} from '../../src/shared/preferences/domain/preferences'
import { createI18n, resources } from '../../src/shared/i18n'

describe('Preferences and translations', () => {
  it('Should reject corrupted stored preferences', () => {
    expect(parsePreferences(null)).toEqual(defaultPreferences)
    expect(parsePreferences({ theme: 'invalid', language: 'xx' })).toEqual(defaultPreferences)

    expect(parsePreferences({ theme: 'light', language: 'pt' })).toEqual({
      theme: 'light',
      language: 'pt',
    })
  })

  it('Should provide the same translation keys in all three languages', () => {
    for (const resource of Object.values(resources)) {
      expect(Object.keys(resource.translation).sort()).toEqual(
        Object.keys(resources.es.translation).sort(),
      )
    }
  })

  it('Should isolate instances and translate without leaking language across requests', async () => {
    const spanish = createI18n('es')
    const english = createI18n('en')

    await english.changeLanguage('pt')
    expect(spanish.t('home')).toBe('Inicio')
    expect(english.t('home')).toBe('Início')
  })
})
