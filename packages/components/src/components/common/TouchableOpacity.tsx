import React from 'react'
import {
  Animated,
  TouchableOpacity as TouchableOpacityOriginal,
  TouchableOpacityProps as TouchableOpacityComponentProps,
} from 'react-native'

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(
  TouchableOpacityOriginal,
) as typeof TouchableOpacityOriginal

export interface TouchableOpacityProps extends TouchableOpacityComponentProps {
  animated?: boolean
}

export const TouchableOpacity = React.forwardRef(
  ({ animated, ...props }: TouchableOpacityProps, ref: any) => {
    const TouchableOpacityComponent = animated
      ? AnimatedTouchableOpacity
      : TouchableOpacityOriginal

    return (
      <TouchableOpacityComponent
        activeOpacity={0.5}
        {...props}
        style={[props.style, props.disabled && { opacity: 0.5 }]}
        ref={ref}
      />
    )
  },
)

export type TouchableOpacity = TouchableOpacityOriginal
