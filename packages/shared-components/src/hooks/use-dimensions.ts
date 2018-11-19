import { useEffect, useState } from 'react'
import { Dimensions } from 'react-native'

export function useDimensions() {
  const [dimensions, setDimensions] = useState({
    screen: Dimensions.get('screen'),
    window: Dimensions.get('window'),
  })

  useEffect(() => {
    Dimensions.addEventListener('change', setDimensions)
    return () => Dimensions.removeEventListener('change', setDimensions)
  }, [])

  return dimensions
}
