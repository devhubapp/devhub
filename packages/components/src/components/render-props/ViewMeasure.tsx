import React, { useState } from 'react'
import { LayoutRectangle, View, ViewProps } from 'react-native'

import { Omit } from '@devhub/core'

export interface ViewMeasurerProps extends Omit<ViewProps, 'children'> {
  children: (layout: LayoutRectangle) => React.ReactNode
}

export function ViewMeasurer(props: ViewMeasurerProps) {
  const { children, onLayout, ...otherProps } = props
  const [layout, setLayout] = useState<LayoutRectangle | null>(null)

  return (
    <View
      {...otherProps}
      onLayout={e => {
        setLayout(e.nativeEvent.layout)
        if (onLayout) onLayout(e)
      }}
    >
      {children && layout ? children(layout) : null}
    </View>
  )
}
