import React from 'react'
import {
  TouchableWithoutFeedback as TouchableWithoutFeedbackOriginal,
  View,
} from 'react-native'

import { Touchable, TouchableProps } from './Touchable'

export interface TouchableWithoutFeedbackProps
  extends Omit<TouchableProps, 'TouchableComponent'> {}

export const TouchableWithoutFeedback = React.forwardRef<
  Touchable | View,
  TouchableWithoutFeedbackProps
>((props, ref) => {
  const { children, style, ...otherProps } = props

  return (
    <Touchable
      ref={ref}
      TouchableComponent={TouchableWithoutFeedbackOriginal}
      {...otherProps}
    >
      <View style={[style, props.disabled && { opacity: 0.5 }]}>
        {children}
      </View>
    </Touchable>
  )
})

TouchableWithoutFeedback.displayName = 'TouchableWithoutFeedback'

export type TouchableWithoutFeedback = Touchable
