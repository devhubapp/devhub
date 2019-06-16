import { useEffect, useRef } from 'react'
import { Dimensions, ScaledSize } from 'react-native'
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

    return () => {
      Dimensions.removeEventListener('change', handler)
    }
  }, [])

  return dimensionsRef.current
}
