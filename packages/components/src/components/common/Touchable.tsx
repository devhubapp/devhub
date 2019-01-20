import React from 'react'
import {
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedbackProps,
} from 'react-native'
import { analytics } from '../../libs/analytics'

export interface TouchableProps
  extends TouchableWithoutFeedbackProps,
    TouchableOpacityProps {
  TouchableComponent: any
  analyticsAction?: 'press' | 'toggle' | string | undefined
  analyticsCategory?: 'button' | 'checkbox' | 'link' | string | undefined
  analyticsLabel?: string | undefined
  analyticsPayload?: Record<string, string | number | undefined> | undefined
  analyticsValue?: number | undefined
  selectable?: boolean
}

export const Touchable = React.forwardRef(
  (
    {
      TouchableComponent,
      analyticsAction,
      analyticsCategory,
      analyticsLabel,
      analyticsValue,
      onPress: _onPress,
      selectable,
      ...props
    }: TouchableProps,
    ref: any,
  ) => {
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
      <TouchableComponent
        {...props}
        ref={ref}
        onPress={onPress}
        style={[
          props.style,
          props.disabled && { opacity: 0.5 },
          !onPress && ({ cursor: undefined } as any),
          selectable === true && ({ userSelect: undefined } as any),
        ]}
      />
    )
  },
)

export type Touchable = TouchableOpacity
