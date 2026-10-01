import { AppProviders } from './providers/app-providers'
import { HomePage } from '@/modules/home'

export function App() {
  return (
    <AppProviders>
      <HomePage />
    </AppProviders>
  )
}
