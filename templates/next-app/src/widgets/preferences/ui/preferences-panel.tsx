'use client'

import { useTranslation } from 'react-i18next'
import { ThemeToggle } from '@/features/appearance'
import { LanguageSelect } from '@/features/language'

export function PreferencesPanel() {
  const { t } = useTranslation()

  return (
    <section className="preferences-panel" aria-label={t('preferences')}>
      <div>
        <p className="eyebrow">{t('preferences')}</p>
        <p className="muted">{t('persistence')}</p>
      </div>
      <div className="preferences-controls">
        <LanguageSelect />
        <div className="language-field">
          <span>{t('appearance')}</span>
          <ThemeToggle />
        </div>
      </div>
    </section>
  )
}
