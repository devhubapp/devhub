import { useRef } from 'react'

export function useDynamicRef<T>(value: T) {
  const ref = useRef(value)
  if (ref.current !== value) ref.current = value

  return ref
}
