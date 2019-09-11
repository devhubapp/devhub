import React from 'react'
import {
  TouchableWithoutFeedback as TouchableWithoutFeedbackOriginal,
  View,
} from 'react-native'

import { sharedStyles } from '../../styles/shared'
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
      style={sharedStyles.opacity100}
    >
      <View style={[props.disabled && sharedStyles.muted, style]}>
        {children}
      </View>
    </Touchable>
  )
})

TouchableWithoutFeedback.displayName = 'TouchableWithoutFeedback'

export type TouchableWithoutFeedback = Touchable
