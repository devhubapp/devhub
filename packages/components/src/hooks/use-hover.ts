import debounce from 'lodash/debounce'
import { RefObject, useCallback, useEffect, useRef } from 'react'

import { Platform } from '../libs/platform'
import { findNode } from '../utils/helpers/shared'
import { useForceRerender } from './use-force-rerender'

export function useHover(
  ref: RefObject<Element | any> | null,
  callback?: (isHovered: boolean) => void,
) {
  const forceRerender = useForceRerender()
  const cacheRef = useRef(false)

  if (Platform.supportsTouch) return false

  const resolve = useCallback(
    debounce(
      (value: boolean) => {
        if (cacheRef.current === value) return
        cacheRef.current = value

        if (callback) {
          callback(value)
          return
        }

        forceRerender()
      },
      5,
      { leading: false, trailing: true },
    ),
    [callback],
  )

  useEffect(() => {
    const node = findNode(ref)

    if (!(node && typeof node.addEventListener === 'function')) return

    const handleMouseOver = () => resolve(true)
    const handleMouseOut = () => resolve(false)

    node.addEventListener('mouseover', handleMouseOver)
    node.addEventListener('mouseout', handleMouseOut)

    return () => {
      if (!node) return

      node.removeEventListener('mouseover', handleMouseOver)
      node.removeEventListener('mouseout', handleMouseOut)
    }
  }, [ref && ref.current, resolve])

  return cacheRef.current
}
