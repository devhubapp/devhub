import { useAppLayout } from '../components/context/LayoutContext'

export function useAppViewMode() {
  const { sizename } = useAppLayout()

  return {
    appViewMode: sizename <= '2-medium' ? 'single-column' : 'multi-column',
  }
}
