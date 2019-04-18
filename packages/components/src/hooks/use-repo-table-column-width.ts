import { useAppLayout } from '../components/context/LayoutContext'

export function useRepoTableColumnWidth() {
  const { sizename } = useAppLayout()
  return sizename >= '5-xx-large' ? 100 : 80
}
