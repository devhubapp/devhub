import { InputIdentityList, useEffect } from 'react'

import { emitter } from '../setup'

export type EmitterType = 'FOCUS_ON_COLUMN'

export function useEmitter(
  key?: EmitterType,
  callback?: (payload: any) => void,
  inputs: InputIdentityList = [],
) {
  useEffect(
    () => {
      if (!(key && callback)) return

      const listener = emitter.addListener(key, callback)
      return () => listener.remove()
    },
    [key, ...inputs],
  )

  return emitter
}
