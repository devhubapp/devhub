import { Theme, ThemeColors } from '@devhub/core/src'
import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import {
  StyleSheet,
  TouchableHighlightProps,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedbackProps,
} from 'react-native'

import { useDynamicRef } from '../../hooks/use-dynamic-ref'
import { useHover } from '../../hooks/use-hover'
import { analytics } from '../../libs/analytics'
import { Platform } from '../../libs/platform'
import { findNode } from '../../utils/helpers/shared'
import { getTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from '../themed/helpers'

export interface TouchableProps
  extends TouchableWithoutFeedbackProps,
    TouchableOpacityProps,
    TouchableHighlightProps,
    TouchableWithoutFeedbackProps {
  TouchableComponent: any
  analyticsAction?: 'press' | 'toggle' | string | undefined
  analyticsCategory?: 'button' | 'checkbox' | 'link' | string | undefined
  analyticsLabel?: string | undefined
  analyticsValue?: number | undefined
  children?: React.ReactNode
  hoverBackgroundThemeColor?:
    | keyof ThemeColors
    | ((theme: Theme) => string | undefined)
    | null
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
      hoverBackgroundThemeColor,
      onLongPress: _onLongPress,
      onPress: _onPress,
      onPressIn: _onPressIn,
      onPressOut: _onPressOut,
      selectable,
      tooltip,
      ...props
    }: TouchableProps,
    ref,
  ) => {
    const touchableRef = useRef<TouchableOpacity>(null)
    const pressInPagePointRef = useRef({ x: 0, y: 0 })

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
      if (!(Platform.OS === 'web' && !Platform.supportsTouch)) return

      const node = findNode(touchableRef)
      if (!node) return

      node.title = tooltip || ''
      if (!tooltip && node.removeAttribute) node.removeAttribute('title')
    }, [touchableRef.current, tooltip])

    const onLongPress: typeof _onLongPress =
      _onLongPress ||
      (tooltip && Platform.supportsTouch
        ? () => {
            alert(tooltip)
          }
        : undefined)

    const onPressIn = useCallback<NonNullable<TouchableProps['onPressIn']>>(
      e => {
        if (Platform.OS === 'web' && e.nativeEvent) {
          pressInPagePointRef.current = {
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY,
          }
        }

        if (_onPressIn) _onPressIn(e)
      },
      [_onPressIn],
    )

    const onPressOut = useCallback<NonNullable<TouchableProps['onPressOut']>>(
      e => {
        if (_onPressOut) _onPressOut(e)

        if (Platform.OS === 'web' && e.nativeEvent) {
          const [x, y] = [e.nativeEvent.pageX, e.nativeEvent.pageY]
          if (
            Math.abs(pressInPagePointRef.current.x - x) > 1 ||
            Math.abs(pressInPagePointRef.current.y - y) > 1
          ) {
            e.preventDefault()
          }
        }
      },
      [_onPressOut],
    )

    const onPress = useCallback<NonNullable<TouchableProps['onPress']>>(
      e => {
        if (analyticsLabel) {
          analytics.trackEvent(
            analyticsCategory || 'button',
            analyticsAction || 'press',
            analyticsLabel,
            analyticsValue,
          )
        }

        if (e && e.isDefaultPrevented()) return
        if (_onPress) _onPress(e)
      },
      [
        _onPress,
        analyticsCategory || 'button',
        analyticsAction || 'press',
        analyticsLabel,
        analyticsValue,
      ],
    )

    const styleRef = useDynamicRef(props.style)
    useHover(
      hoverBackgroundThemeColor ? touchableRef : null,
      useCallback(isHovered => {
        if (
          !(
            touchableRef &&
            touchableRef.current &&
            touchableRef.current.setNativeProps
          )
        )
          return

        touchableRef.current.setNativeProps({
          style: {
            backgroundColor: isHovered
              ? getThemeColorOrItself(getTheme(), hoverBackgroundThemeColor, {
                  enableCSSVariable: true,
                })
              : StyleSheet.flatten(styleRef.current).backgroundColor,
          },
        })
      }, []),
    )

    return (
      <TouchableComponent
        {...props}
        ref={touchableRef}
        data-touchable
        data-touchable-disabled={!!props.disabled}
        data-touchable-onpress={!!_onPress}
        onLongPress={onLongPress}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          props.disabled && { opacity: 0.5 },
          selectable === true && ({ userSelect: undefined } as any),
          props.style,
        ]}
      />
    )
  },
)

Touchable.displayName = 'Touchable'

export type Touchable = TouchableOpacity
