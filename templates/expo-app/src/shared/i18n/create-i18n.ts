import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'

import es from './locales/es.json'
import en from './locales/en.json'
import pt from './locales/pt.json'

export const resources = {
  es: { translation: es },
  en: { translation: en },
  pt: { translation: pt },
}

export function createI18n(language = 'es') {
  const instance = createInstance()

  instance.use(initReactI18next)

  void instance.init({
    resources,
    lng: language,
    fallbackLng: 'es',
    supportedLngs: ['es', 'en', 'pt'],
    initImmediate: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })

  return instance
}
