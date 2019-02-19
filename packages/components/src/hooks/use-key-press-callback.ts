import { DependencyList, KeyboardEvent, useEffect } from 'react'

export function useKeyPressCallback(
  callback: (e: KeyboardEvent) => void,
  keyOrKeys: string | [string] | undefined,
  deps: DependencyList,
) {
  useEffect(
    () => {
      if (!(window && typeof window.addEventListener === 'function')) return

      const handler = (e: KeyboardEvent) => {
        if (
          typeof keyOrKeys === 'undefined' ||
          (typeof keyOrKeys === 'string' && e.key === keyOrKeys) ||
          (Array.isArray(keyOrKeys) && keyOrKeys.includes(e.key))
        )
          callback(e)
      }

      window.addEventListener('keypress', handler as any)
      return () => {
        window.removeEventListener('keypress', handler as any)
      }
    },
    [...(Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys]), ...deps],
  )
}
