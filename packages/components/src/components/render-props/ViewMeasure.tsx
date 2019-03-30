import React, { useState } from 'react'
import { View, ViewProps } from 'react-native'

import { Omit } from '@devhub/core'

export interface ViewMeasurerProps extends Omit<ViewProps, 'children'> {
  children: (layout: { width: number; height: number }) => React.ReactNode
}

export function ViewMeasurer(props: ViewMeasurerProps) {
  const { children, onLayout, ...otherProps } = props
  const [layout, setLayout] = useState<{
    width: number
    height: number
  } | null>(null)

  return (
    <View
      {...otherProps}
      onLayout={e => {
        const { width, height } = e.nativeEvent.layout
        if (layout && width === layout.width && height === layout.height) return

        setLayout(e.nativeEvent.layout)
        if (onLayout) onLayout(e)
      }}
    >
      {children && layout ? children(layout) : null}
    </View>
  )
}
