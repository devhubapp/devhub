import { useLayoutEffect, useState } from 'react'

import { OS, PlatformCategory } from '@brunolemos/devhub-core/dist'
import { getOSName, getPlatformCategory } from '../helpers'

interface System {
  category: PlatformCategory | undefined
  os: OS | undefined
}

export function useSystem(): System {
  const [system, setSystem] = useState<System>({
    category: undefined,
    os: undefined,
  })

  // this is required because of the value mismatch between server ssr and client
  useLayoutEffect(() => {
    setSystem({ category: getPlatformCategory(), os: getOSName() })
  }, [])

  return system
}
