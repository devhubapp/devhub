import React, { useCallback, useRef } from 'react'
import { StyleSheet } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { useDynamicRef } from '../../hooks/use-dynamic-ref'
import { useHover } from '../../hooks/use-hover'
import { IconProp } from '../../libs/vector-icons'
import { sharedStyles } from '../../styles/shared'
import { contentPadding, scaleFactor } from '../../styles/variables'
import { getTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from '../themed/helpers'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'
import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from './TouchableWithoutFeedback'

export type IconButtonProps = TouchableWithoutFeedbackProps & {
  active?: boolean
  size?: number
  type?: 'primary' | 'neutral' | 'danger'
} & IconProp

export const defaultIconButtonSize = 16 * scaleFactor

export function IconButton(props: IconButtonProps) {
  const {
    active,
    disabled: _disabled,
    family,
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
  const disabledRef = useDynamicRef(_disabled)

  const {
    foregroundThemeColor: _foregroundThemeColor,
    tintBackgroundHoveredOpacity,
    tintBackgroundPressedOpacity,
    tintThemeColor,
  } = getIconButtonColors(type)

  const handleDisabledOpacityInternally =
    _foregroundThemeColor === 'foregroundColor'

  const foregroundThemeColor: typeof _foregroundThemeColor =
    handleDisabledOpacityInternally && disabledRef.current
      ? 'foregroundColorMuted40'
      : (active && tintThemeColor) || _foregroundThemeColor

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
            (isHoveredRef.current || isPressedRef.current || active) &&
            tintThemeColor &&
            !disabledRef.current
              ? getThemeColorOrItself(theme, tintThemeColor, {
                  enableCSSVariable: true,
                })
              : getThemeColorOrItself(theme, foregroundThemeColor, {
                  enableCSSVariable: true,
                }),
        },
      })
    }
  }, [
    active,
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
        handleDisabledOpacityInternally && sharedStyles.opacity100,
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
              opacity: active ? tintBackgroundHoveredOpacity : 0,
            },
          ]}
        />

        <ThemedText ref={textRef} color={foregroundThemeColor}>
          <ThemedIcon
            family={family as any}
            name={name as any}
            selectable={false}
            size={size}
            style={sharedStyles.textCenter}
          />
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
