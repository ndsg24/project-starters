'use client'

import { useTranslation } from 'react-i18next'

import { languages, usePreferences } from '@/shared/preferences'

const labels = { es: 'Español', en: 'English', pt: 'Português' }

export function LanguageSelect() {
  const { t } = useTranslation()
  const { preferences, ready, setLanguage } = usePreferences()

  return (
    <label className="language-field">
      <span>{t('language')}</span>
      <select
        className="control"
        disabled={!ready}
        value={preferences.language}
        onChange={(event) => {
          const selected = languages.find((language) => language === event.target.value)

          if (selected) {
            setLanguage(selected)
          }
        }}>
        {languages.map((language) => (
          <option key={language} value={language}>
            {labels[language]}
          </option>
        ))}
      </select>
    </label>
  )
}
