import { useEffect, useRef } from 'react'

export function usePreviousRef<T>(value: T) {
  const ref = useRef<T | undefined>(undefined)
  const nextRef = useRef<T | undefined>(undefined)

  useEffect(() => {
    const temp = nextRef.current
    nextRef.current = value
    ref.current = temp
  }, [value])

  return ref
}
