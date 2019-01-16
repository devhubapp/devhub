import { RefObject, useEffect, useState } from 'react'

import { Platform } from '../libs/platform'

export function useHover(ref: RefObject<Element> | null) {
  if (Platform.realOS !== 'web') return

  const [isHovered, setIsHovered] = useState(false)

  useEffect(
    () => {
      let node = ref && ref.current

      if (node && (node as any).getNode && (node as any).getNode())
        node = (node as any).getNode()

      if (node && (node as any)._touchableNode)
        node = (node as any)._touchableNode

      if (node && (node as any)._node) node = (node as any)._node

      if (!(node && typeof node.addEventListener === 'function')) return

      const handleMouseOver = () => setIsHovered(true)
      const handleMouseOut = () => setIsHovered(false)

      node.addEventListener('mouseover', handleMouseOver)
      node.addEventListener('mouseout', handleMouseOut)

      return () => {
        if (!node) return

        node.removeEventListener('mouseover', handleMouseOver)
        node.removeEventListener('mouseout', handleMouseOut)
      }
    },
    [ref && ref.current],
  )

  return isHovered
}
