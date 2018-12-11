import React from 'react'
import {
  Animated,
  TouchableOpacity as TouchableOpacityOriginal,
  TouchableOpacityProps as TouchableOpacityComponentProps,
} from 'react-native'
import { analytics } from '../../libs/analytics'

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(
  TouchableOpacityOriginal,
) as typeof TouchableOpacityOriginal

export interface TouchableOpacityProps extends TouchableOpacityComponentProps {
  analyticsCategory?: 'button' | 'checkbox' | 'link' | string | undefined
  analyticsAction?: 'press' | 'toggle' | string | undefined
  analyticsLabel?: string | undefined
  analyticsValue?: number | undefined
  analyticsPayload?: Record<string, string | number | undefined> | undefined
  animated?: boolean
  className?: string
}

export const TouchableOpacity = React.forwardRef(
  (
    {
      analyticsAction,
      analyticsCategory,
      analyticsLabel,
      analyticsValue,
      animated,
      onPress: _onPress,
      ...props
    }: TouchableOpacityProps,
    ref: any,
  ) => {
    const TouchableOpacityComponent = animated
      ? AnimatedTouchableOpacity
      : TouchableOpacityOriginal

    const onPress: typeof _onPress =
      analyticsAction || analyticsCategory || analyticsLabel || analyticsValue
        ? e => {
            analytics.trackEvent(
              analyticsCategory || 'button',
              analyticsAction || 'press',
              analyticsLabel,
              analyticsValue,
            )
            if (_onPress) _onPress(e)
          }
        : _onPress

    return (
      <TouchableOpacityComponent
        activeOpacity={0.5}
        {...props}
        ref={ref}
        className={`touchable-opacity ${props.className || ''}`.trim()}
        onPress={onPress}
        style={[props.style, props.disabled && { opacity: 0.5 }]}
      />
    )
  },
)

export type TouchableOpacity = TouchableOpacityOriginal
