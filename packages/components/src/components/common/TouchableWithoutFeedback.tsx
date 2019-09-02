import React from 'react'
import {
  TouchableOpacity as TouchableOpacityOriginal,
  View,
} from 'react-native'

import { Touchable, TouchableProps } from './Touchable'

export interface TouchableWithoutFeedbackProps
  extends Omit<TouchableProps, 'TouchableComponent'> {}

export const TouchableWithoutFeedback = React.forwardRef<
  Touchable | View,
  TouchableWithoutFeedbackProps
>((props, ref) => {
  return (
    <Touchable
      ref={ref}
      TouchableComponent={TouchableOpacityOriginal}
      activeOpacity={1}
      {...props}
    />
  )
})

TouchableWithoutFeedback.displayName = 'TouchableWithoutFeedback'

export type TouchableWithoutFeedback = TouchableOpacityOriginal
