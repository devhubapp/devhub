import React from 'react'
import { TouchableOpacity as TouchableOpacityOriginal } from 'react-native'

import { Omit } from '@devhub/core'
import { Touchable, TouchableProps } from './Touchable'

export interface TouchableOpacityProps
  extends Omit<TouchableProps, 'TouchableComponent'> {
  TouchableComponent?: TouchableProps['TouchableComponent']
}

export const TouchableOpacity = React.forwardRef(
  (props: TouchableOpacityProps, ref: any) => {
    return (
      <Touchable
        ref={ref}
        TouchableComponent={TouchableOpacityOriginal}
        activeOpacity={0.5}
        {...props}
      />
    )
  },
)

export type TouchableOpacity = TouchableOpacityOriginal
