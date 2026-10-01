'use client'

import { useTranslation } from 'react-i18next'
import { PreferencesPanel } from '@/widgets/preferences'

export function HomePage() {
  const { t } = useTranslation()
  return (
    <main className="shell">
      <header className="masthead">
        <span className="wordmark">
          Project Starters<span aria-hidden="true">.</span>
        </span>
        <span className="status">{t('ready')}</span>
      </header>
      <section className="hero">
        <p className="eyebrow">{t('home')}</p>
        <h1>{t('title')}</h1>
        <p className="lead">{t('description')}</p>
      </section>
      <PreferencesPanel />
      <section className="architecture-note">
        <h2>{t('architecture')}</h2>
        <p className="muted">{t('architectureDescription')}</p>
        <code>app / modules / widgets / features / shared</code>
      </section>
    </main>
  )
}
