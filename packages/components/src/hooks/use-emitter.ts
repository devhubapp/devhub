import { DependencyList, useEffect } from 'react'

import { emitter } from '../setup'

export type EmitterType = 'FOCUS_ON_COLUMN'

export function useEmitter(
  key?: EmitterType,
  callback?: (payload: any) => void,
  deps: DependencyList = [],
) {
  useEffect(
    () => {
      if (!(key && callback)) return

      const listener = emitter.addListener(key, callback)
      return () => listener.remove()
    },
    [key, ...deps],
  )

  return emitter
}
