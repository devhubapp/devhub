import { useState } from 'react'

import { useEmitter } from './use-emitter'

let lastInputType: 'keyboard' | 'mouse' | undefined
export function useLastInputType() {
  const [inputType, setInputType] = useState<'keyboard' | 'mouse' | undefined>()

  useEmitter(
    'SET_LAST_INPUT_TYPE',
    payload => {
      lastInputType = payload.type
      setInputType(payload.type)
    },
    [],
  )

  return inputType
}

export function getLastUsedInputType() {
  return lastInputType
}
