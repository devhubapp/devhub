import { AppViewMode } from '@devhub/core'
import { useAppLayout } from '../components/context/LayoutContext'

export function useAppViewMode(): { appViewMode: AppViewMode } {
  const { sizename } = useAppLayout()

  return {
    appViewMode: sizename <= '2-medium' ? 'single-column' : 'multi-column',
  }
}
