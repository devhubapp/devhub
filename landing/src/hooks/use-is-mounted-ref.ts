import { useEffect, useRef } from 'react'

export function useIsMountedRef<T>() {
  const ref = useRef(true)

  useEffect(() => {
    ref.current = true

    return () => {
      ref.current = false
    }
  }, [])

  return ref
}
