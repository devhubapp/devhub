import flatted from 'flatted'
import _ from 'lodash'
import { useEffect, useRef } from 'react'

export function useWhyDidYouUpdate(
  name: string,
  props: Record<string, any>,
  {
    onChangeFound,
    onNoChangeFound,
  }: {
    onChangeFound?: (data: {
      changesObj: Record<
        string,
        { from: any; to: any; isDeepEqual: boolean; changedKeys?: string[] }
      >
    }) => void
    onNoChangeFound?: () => void
  } = {},
) {
  const latestProps = useRef(props)

  useEffect(() => {
    if (!__DEV__) return

    const allKeys = Object.keys({ ...latestProps.current, ...props })

    const changesObj: Record<
      string,
      { from: any; to: any; isDeepEqual: boolean; changedKeys?: string[] }
    > = {}
    allKeys.forEach((key) => {
      if (latestProps.current[key] !== props[key]) {
        changesObj[key] = {
          from: latestProps.current[key],
          to: props[key],
          changedKeys:
            props[key] && typeof props[key] === 'object'
              ? (Object.keys(latestProps.current[key])
                  .map((k) =>
                    latestProps.current[key][k] === props[key][k] ? '' : k,
                  )
                  .filter(Boolean) as string[])
              : undefined,
          isDeepEqual: _.isEqual(latestProps.current[key], props[key]),
        }
      }
    })

    if (Object.keys(changesObj).length) {
      if (onChangeFound) {
        onChangeFound({ changesObj })
      } else {
        // tslint:disable-next-line no-console
        console.log('[why-did-you-update]', name, {
          changes: flatted.parse(flatted.stringify(changesObj)),
          props: { from: latestProps.current, to: props },
        })
      }
    } else if (onNoChangeFound) {
      onNoChangeFound()
    }

    latestProps.current = props
  })
}
