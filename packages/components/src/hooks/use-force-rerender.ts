import { useState } from 'react'

export function useForceRerender() {
  const [, setValue] = useState(false)

  return () => setValue(value => !value)
}
