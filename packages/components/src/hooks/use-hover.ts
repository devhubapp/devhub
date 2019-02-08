import { RefObject, useEffect, useRef, useState } from 'react'

import { Platform } from '../libs/platform'
import { findNode } from '../utils/helpers/shared'

export function useHover(
  ref: RefObject<Element | any> | null,
  callback?: (isHovered: boolean) => void,
) {
  if (Platform.realOS !== 'web') return false

  const cacheRef = useRef(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(
    () => {
      const node = findNode(ref)

      if (!(node && typeof node.addEventListener === 'function')) return

      const resolve = (value: boolean) => {
        if (cacheRef.current === value) return

        cacheRef.current = value

        if (callback) {
          callback(value)
          return
        }

        setIsHovered(value)
      }

      const handleMouseOver = () => resolve(true)
      const handleMouseOut = () => resolve(false)

      node.addEventListener('mouseover', handleMouseOver)
      node.addEventListener('mouseout', handleMouseOut)

      return () => {
        if (!node) return

        node.removeEventListener('mouseover', handleMouseOver)
        node.removeEventListener('mouseout', handleMouseOut)
      }
    },
    [ref && ref.current, callback],
  )

  return isHovered
}
