/** @jest-environment jsdom */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PreferencesProvider } from '../../src/shared/preferences'
import { HomePage } from '../../src/modules/home'

it('Should restore preferences, switch language and theme, and persist both', async () => {
  const save = jest.fn().mockResolvedValue(undefined)
  render(
    <PreferencesProvider store={{ load: async () => ({ theme: 'dark', language: 'es' }), save }}>
      <HomePage />
    </PreferencesProvider>,
  )
  await waitFor(() => expect(screen.getByRole('combobox')).toBeEnabled())
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'en' } })
  expect(
    await screen.findByRole('heading', { name: 'Your next project starts here.' }),
  ).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Change theme' }))
  await waitFor(() => expect(save).toHaveBeenLastCalledWith({ theme: 'light', language: 'en' }))
})
