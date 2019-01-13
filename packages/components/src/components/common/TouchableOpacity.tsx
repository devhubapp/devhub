import React from 'react'
import {
  TouchableOpacity as TouchableOpacityOriginal,
  TouchableOpacityProps as TouchableOpacityComponentProps,
} from 'react-native'
import { analytics } from '../../libs/analytics'
import { AnimatedTouchableOpacity } from '../animated/AnimatedTouchableOpacity'

export interface TouchableOpacityProps extends TouchableOpacityComponentProps {
  analyticsAction?: 'press' | 'toggle' | string | undefined
  analyticsCategory?: 'button' | 'checkbox' | 'link' | string | undefined
  analyticsLabel?: string | undefined
  analyticsPayload?: Record<string, string | number | undefined> | undefined
  analyticsValue?: number | undefined
  animated?: boolean
  className?: string
  selectable?: boolean
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
      selectable,
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
        style={[
          props.style,
          props.disabled && { opacity: 0.5 },
          selectable === true && ({ userSelect: undefined } as any),
        ]}
      />
    )
  },
)

export type TouchableOpacity = TouchableOpacityOriginal
