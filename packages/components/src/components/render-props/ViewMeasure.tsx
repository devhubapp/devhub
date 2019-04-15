import React, { useState } from 'react'
import { View, ViewProps } from 'react-native'

import { Omit } from '@devhub/core'

export interface ViewMeasurerProps extends Omit<ViewProps, 'children'> {
  children: (measures: { width: number; height: number }) => React.ReactNode
  defaultMeasures?: { width: number; height: number } | null
  properties: 'width' | 'height' | 'all'
}

export function ViewMeasurer(props: ViewMeasurerProps) {
  const {
    children,
    defaultMeasures = { width: 0, height: 0 },
    onLayout,
    properties,
    ...otherProps
  } = props
  const [measures, setMeasures] = useState<{
    width: number
    height: number
  } | null>(defaultMeasures)

  return (
    <View
      {...otherProps}
      onLayout={e => {
        const layout = e.nativeEvent.layout

        const width =
          properties === 'width' || properties === 'all' ? layout.width : 0
        const height =
          properties === 'height' || properties === 'all' ? layout.height : 0

        if (measures && width === measures.width && height === measures.height)
          return

        setMeasures({ width, height })
        if (onLayout) onLayout(e)
      }}
    >
      {children && measures ? children(measures) : null}
    </View>
  )
}
