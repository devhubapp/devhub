import React from 'react'
import { TouchableHighlight as TouchableHighlightOriginal } from 'react-native'

import { Touchable, TouchableProps } from './Touchable'

export type TouchableHighlightProps = Omit<TouchableProps, 'TouchableComponent'>

export const TouchableHighlight = React.forwardRef<
  Touchable,
  TouchableHighlightProps
>((props, ref) => {
  return (
    <Touchable
      ref={ref}
      TouchableComponent={TouchableHighlightOriginal}
      underlayColor="red"
      {...props}
    />
  )
})

TouchableHighlight.displayName = 'TouchableHighlight'

export type TouchableHighlight = Touchable
