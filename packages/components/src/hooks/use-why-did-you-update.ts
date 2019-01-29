import { useEffect, useRef } from 'react'

export function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
  const latestProps = useRef(props)

  useEffect(() => {
    if (!__DEV__) return

    const allKeys = Object.keys({ ...latestProps.current, ...props })

    const changesObj: Record<string, { from: any; to: any }> = {}
    allKeys.forEach(key => {
      if (latestProps.current[key] !== props[key]) {
        changesObj[key] = { from: latestProps.current[key], to: props[key] }
      }
    })

    if (Object.keys(changesObj).length) {
      // tslint:disable-next-line no-console
      console.log('[why-did-you-update]', name, changesObj)
    }

    latestProps.current = props
  }, Object.values(props))
}
