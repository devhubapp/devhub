import React, { useCallback, useRef } from 'react'
import { StyleSheet } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { useDynamicRef } from '../../hooks/use-dynamic-ref'
import { useHover } from '../../hooks/use-hover'
import { OcticonIconProps, Octicons } from '../../libs/vector-icons'
import { sharedStyles } from '../../styles/shared'
import {
  columnHeaderItemContentSize,
  contentPadding,
} from '../../styles/variables'
import { getTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from '../themed/helpers'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'
import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from './TouchableWithoutFeedback'

export interface IconButtonProps extends TouchableWithoutFeedbackProps {
  active?: boolean
  name: OcticonIconProps['name']
  size?: number
  type?: 'primary' | 'neutral' | 'danger'
}

export const defaultIconButtonSize = columnHeaderItemContentSize

export function IconButton(props: IconButtonProps) {
  const {
    active: _active,
    disabled: _disabled,
    name,
    onPressIn,
    onPressOut,
    size = defaultIconButtonSize,
    style,
    type = 'neutral',
    ...touchableProps
  } = props

  const touchableRef = useRef<TouchableWithoutFeedback>(null)
  const innerBackgroundViewRef = useRef<TouchableWithoutFeedback>(null)
  const textRef = useRef<ThemedText>(null)

  const isHoveredRef = useRef(false)
  const isPressedRef = useRef(false)
  const activeRef = useDynamicRef(_active)
  const disabledRef = useDynamicRef(_disabled)

  const {
    foregroundThemeColor,
    tintBackgroundHoveredOpacity,
    tintBackgroundPressedOpacity,
    tintThemeColor,
  } = getIconButtonColors(type)

  const updateStyles = useCallback(() => {
    const theme = getTheme()

    if (innerBackgroundViewRef.current) {
      innerBackgroundViewRef.current.setNativeProps({
        style: {
          backgroundColor:
            (isPressedRef.current || isHoveredRef.current) &&
            tintThemeColor &&
            !disabledRef.current
              ? getThemeColorOrItself(theme, tintThemeColor, {
                  enableCSSVariable: true,
                })
              : 'transparent',
          opacity: disabledRef.current
            ? 0
            : isPressedRef.current
            ? tintBackgroundPressedOpacity
            : isHoveredRef.current
            ? tintBackgroundHoveredOpacity
            : 0,
        },
      })
    }

    if (textRef.current) {
      textRef.current.setNativeProps({
        style: {
          color:
            (isHoveredRef.current ||
              isPressedRef.current ||
              activeRef.current) &&
            tintThemeColor &&
            !disabledRef.current
              ? getThemeColorOrItself(theme, tintThemeColor, {
                  enableCSSVariable: true,
                })
              : getThemeColorOrItself(
                  theme,
                  foregroundThemeColor || 'foregroundColor',
                  {
                    enableCSSVariable: true,
                  },
                ),
        },
      })
    }
  }, [
    foregroundThemeColor,
    tintBackgroundHoveredOpacity,
    tintBackgroundPressedOpacity,
    tintThemeColor,
  ])

  useHover(
    touchableRef,
    useCallback(
      isHovered => {
        isHoveredRef.current = isHovered
        updateStyles()
      },
      [updateStyles],
    ),
  )

  return (
    <TouchableWithoutFeedback
      ref={touchableRef}
      {...touchableProps}
      disabled={disabledRef.current}
      onPressIn={e => {
        isPressedRef.current = true
        updateStyles()

        if (onPressIn) onPressIn(e)
      }}
      onPressOut={e => {
        isPressedRef.current = false
        updateStyles()

        if (onPressOut) onPressOut(e)
      }}
      style={[
        sharedStyles.center,
        sharedStyles.paddingHalf,
        {
          width: size + contentPadding,
          height: size + contentPadding,
          borderRadius: (size + contentPadding) / 2,
        },
        style,
      ]}
    >
      <>
        <ThemedView
          ref={innerBackgroundViewRef}
          backgroundColor={tintThemeColor}
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: (size + contentPadding) / 2,
              opacity: activeRef.current ? tintBackgroundHoveredOpacity : 0,
            },
          ]}
        />

        <ThemedText ref={textRef} color={foregroundThemeColor}>
          <Octicons name={name} size={size} style={sharedStyles.textCenter} />
        </ThemedText>
      </>
    </TouchableWithoutFeedback>
  )
}

export function getIconButtonColors(
  type?: IconButtonProps['type'],
): {
  foregroundThemeColor: keyof ThemeColors
  tintBackgroundHoveredOpacity: number
  tintBackgroundPressedOpacity: number
  tintThemeColor: keyof ThemeColors
} {
  switch (type) {
    case 'danger':
      return {
        foregroundThemeColor: 'foregroundColor',
        tintBackgroundHoveredOpacity: 0.1,
        tintBackgroundPressedOpacity: 0.2,
        tintThemeColor: 'red',
      }

    case 'primary':
      return {
        foregroundThemeColor: 'primaryForegroundColor',
        tintBackgroundHoveredOpacity: 0.1,
        tintBackgroundPressedOpacity: 0.2,
        tintThemeColor: 'primaryBackgroundColor',
      }

    default:
      return {
        foregroundThemeColor: 'foregroundColor',
        tintBackgroundHoveredOpacity: 0.1,
        tintBackgroundPressedOpacity: 0.2,
        tintThemeColor: 'primaryBackgroundColor',
      }
  }
}
