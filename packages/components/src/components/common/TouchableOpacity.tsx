import React from 'react'
import { TouchableOpacity as TouchableOpacityOriginal } from 'react-native'

import { Touchable, TouchableProps } from './Touchable'

export interface TouchableOpacityProps
  extends Omit<TouchableProps, 'TouchableComponent'> {}

export const TouchableOpacity = React.forwardRef<
  Touchable,
  TouchableOpacityProps
>((props, ref) => {
  return (
    <Touchable
      ref={ref}
      TouchableComponent={TouchableOpacityOriginal}
      activeOpacity={props.onPress ? 0.5 : 1}
      {...props}
    />
  )
})

TouchableOpacity.displayName = 'TouchableOpacity'

export type TouchableOpacity = Touchable
