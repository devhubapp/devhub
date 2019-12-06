import { AppViewMode } from '@devhub/core'
import { useMemo } from 'react'

import { useAppLayout } from '../components/context/LayoutContext'

export function useAppViewMode(): { appViewMode: AppViewMode } {
  const { sizename } = useAppLayout()

  const appViewMode = sizename <= '2-medium' ? 'single-column' : 'multi-column'

  return useMemo(() => ({ appViewMode }), [appViewMode])
}
