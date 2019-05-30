import React from 'react'
import { TouchableOpacity as TouchableOpacityOriginal } from 'react-native'

import { Touchable, TouchableProps } from './Touchable'

export interface TouchableOpacityProps
  extends Omit<TouchableProps, 'TouchableComponent'> {
  TouchableComponent?: TouchableProps['TouchableComponent']
}

export const TouchableOpacity = React.forwardRef(
  (props: TouchableOpacityProps, ref) => {
    return (
      <Touchable
        ref={ref}
        TouchableComponent={TouchableOpacityOriginal}
        activeOpacity={props.onPress ? 0.5 : 1}
        {...props}
      />
    )
  },
)

export type TouchableOpacity = TouchableOpacityOriginal
