import { useEffect, useRef } from 'react'
import { Dimensions, ScaledSize } from 'react-native'

import { Platform } from '../libs/platform'
import { useForceRerender } from './use-force-rerender'

export function useDimensions(only?: 'width' | 'height') {
  const dimensionsRef = useRef({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  })
  const forceRerender = useForceRerender()

  function hasChanged(width: number, height: number) {
    return !!(
      (only !== 'height' && width !== dimensionsRef.current.width) ||
      (only !== 'width' && height !== dimensionsRef.current.height)
    )
  }

  function setDimensions(width: number, height: number) {
    if (!hasChanged(width, height)) return

    dimensionsRef.current.width = width
    dimensionsRef.current.height = height
    forceRerender()
  }

  useEffect(() => {
    const handler = ({ window }: { window: ScaledSize }) => {
      const { width, height } = window
      setDimensions(width, height)
    }

    Dimensions.addEventListener('change', handler)

    // fix for iOS safari not properly triggering after pinch to zoom
    // @see https://github.com/necolas/react-native-web/issues/1369
    let interval: ReturnType<typeof setInterval>
    if (Platform.OS === 'web' && Platform.realOS === 'ios') {
      interval = setInterval(() => {
        const width = Math.min(
          window.innerWidth,
          window.outerWidth || window.innerWidth,
        )
        const height = Math.min(
          window.innerHeight,
          window.outerHeight || window.innerHeight,
        )
        if (!(width > 0 && height > 0)) return

        if (!hasChanged(width, height)) return

        if ((Dimensions as any)._update) (Dimensions as any)._update()
        else setDimensions(width, height)
      }, 1000)
    }

    return () => {
      Dimensions.removeEventListener('change', handler)
      if (interval) clearInterval(interval)
    }
  }, [])

  return dimensionsRef.current
}
