import React, { useEffect, useLayoutEffect, useRef } from 'react'
import {
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedbackProps,
} from 'react-native'
import { analytics } from '../../libs/analytics'
import { Platform } from '../../libs/platform'
import { findNode } from '../../utils/helpers/shared'

export interface TouchableProps
  extends TouchableWithoutFeedbackProps,
    TouchableOpacityProps {
  TouchableComponent: any
  analyticsAction?: 'press' | 'toggle' | string | undefined
  analyticsCategory?: 'button' | 'checkbox' | 'link' | string | undefined
  analyticsLabel?: string | undefined
  analyticsPayload?: Record<string, string | number | undefined> | undefined
  analyticsValue?: number | undefined
  children?: React.ReactNode
  selectable?: boolean
  tooltip?: string
}

export const Touchable = React.forwardRef(
  (
    {
      TouchableComponent,
      analyticsAction,
      analyticsCategory,
      analyticsLabel,
      analyticsValue,
      onLongPress: _onLongPress,
      onPress: _onPress,
      selectable,
      tooltip,
      ...props
    }: TouchableProps,
    ref,
  ) => {
    const touchableRef = useRef<TouchableOpacity>(null)

    useLayoutEffect(() => {
      if (typeof ref === 'function') {
        ref(touchableRef.current)
        return
      }

      if (ref && 'current' in ref) {
        ;(ref as any).current = touchableRef.current
      }
    }, [touchableRef.current])

    useEffect(() => {
      if (Platform.realOS !== 'web') return

      const node = findNode(touchableRef)
      if (!node) return

      node.title = tooltip || ''
      if (!tooltip && node.removeAttribute) node.removeAttribute('title')
    }, [touchableRef.current, tooltip])

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

    const onLongPress: typeof _onLongPress =
      _onLongPress ||
      (tooltip && Platform.realOS !== 'web'
        ? () => {
            alert(tooltip)
          }
        : undefined)

    return (
      <TouchableComponent
        {...props}
        ref={touchableRef}
        data-touchable
        data-touchable-disabled={!!props.disabled}
        data-touchable-onpress={!!onPress}
        onLongPress={onLongPress}
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

Touchable.displayName = 'Touchable'

export type Touchable = TouchableOpacity
