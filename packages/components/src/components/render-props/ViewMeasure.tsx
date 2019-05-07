import _ from 'lodash'
import React, { useRef, useState } from 'react'
import { View, ViewProps } from 'react-native'

import { Omit } from '@devhub/core'

export interface ViewMeasurerProps<
  M extends (measures: { width: number; height: number }) => any = (measures: {
    width: number
    height: number
  }) => any,
  R = M extends (measures: { width: number; height: number }) => infer RR
    ? RR
    : any
> extends Omit<ViewProps, 'children'> {
  children: (result: R) => React.ReactNode
  initialResult: R
  mapper: M
}

export function ViewMeasurer(props: ViewMeasurerProps) {
  const { children, initialResult, mapper, onLayout, ...otherProps } = props

  const measuresRef = useRef<{
    width: number
    height: number
  }>({ width: 0, height: 0 })

  const [result, setResult] = useState(
    typeof initialResult !== 'undefined'
      ? initialResult
      : mapper(measuresRef.current),
  )

  return (
    <View
      {...otherProps}
      onLayout={e => {
        const { width, height } = e.nativeEvent.layout
        measuresRef.current = { width, height }

        if (onLayout) onLayout(e)

        const newResult = mapper({ width, height })
        if (_.isEqual(result, newResult)) return

        setResult(newResult)
      }}
      pointerEvents="box-none"
    >
      {children(result)}
    </View>
  )
}
