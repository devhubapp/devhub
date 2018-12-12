import { useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'

export function useAppVisibility() {
  const [isVisible, setIsVisible] = useState<boolean>(
    AppState.currentState === 'active',
  )

  useEffect(
    () => {
      const handler = (state: AppStateStatus) => {
        const newValue = state === 'active'
        if (newValue === isVisible) return
        setIsVisible(newValue)
      }

      AppState.addEventListener('change', handler)
      return () => AppState.removeEventListener('change', handler)
    },
    [isVisible],
  )

  return isVisible
}
