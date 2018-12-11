import { useEffect, useState } from 'react'

import * as v from '../../libs/visibility'

export function useAppVisibility() {
  const [isVisible, setIsVisible] = useState<boolean | null>(v.isVisible())

  useEffect(
    () => {
      const handler = (newValue: boolean | null) => {
        if (newValue === isVisible) return
        setIsVisible(newValue)
      }

      v.addEventListener(handler)
      return () => v.removeEventListener(handler)
    },
    [isVisible],
  )

  return isVisible
}
