import { useMemo, useRef } from 'react'

export function useDynamicRef<T>(value: T, deps?: any[]) {
  const ref = useRef(value)

  useMemo(() => {
    ref.current = value
  }, deps || [value])

  return ref
}
