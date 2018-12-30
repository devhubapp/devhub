import { useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { Platform } from '../libs/platform'

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

  useEffect(
    () => {
      if (!Platform.isElectron) return

      const focusHandler = () => {
        if (isVisible) return
        setIsVisible(true)
      }

      const blurHandler = () => {
        if (!isVisible) return
        setIsVisible(false)
      }

      window.addEventListener('focus', focusHandler)
      window.addEventListener('blur', blurHandler)

      return () => {
        window.removeEventListener('focus', focusHandler)
        window.removeEventListener('blur', blurHandler)
      }
    },
    [isVisible],
  )

  return isVisible
}
