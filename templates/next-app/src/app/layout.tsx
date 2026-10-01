import { AppProviders } from './providers/app-providers'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@fontsource/manrope/latin.css'
import '@/shared/theme'

export const metadata: Metadata = {
  title: 'Project Starters',
  description: 'Una base ordenada para tu próximo proyecto',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{const p=JSON.parse(localStorage.getItem('starter-preferences')||'null');document.documentElement.dataset.theme=p?.theme==='light'?'light':'dark'}catch{}",
          }}
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
