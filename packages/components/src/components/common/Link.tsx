import React, {
  AnchorHTMLAttributes,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { rgba } from 'polished'
import { useHover } from '../../hooks/use-hover'
import { Browser } from '../../libs/browser'
import { Linking } from '../../libs/linking'
import { Platform } from '../../libs/platform'
import { EMPTY_OBJ } from '../../utils/constants'
import { findNode } from '../../utils/helpers/shared'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from '../themed/helpers'
import { ThemedText, ThemedTextProps } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'
import { TouchableOpacity, TouchableOpacityProps } from './TouchableOpacity'

export interface LinkProps
  extends Omit<TouchableOpacityProps, 'analyticsLabel'> {
  allowEmptyLink?: boolean
  analyticsLabel?: TouchableOpacityProps['analyticsLabel']
  backgroundThemeColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
  enableBackgroundHover?: boolean
  enableForegroundHover?: boolean
  enableTextWrapper?: boolean
  hoverBackgroundThemeColor?:
    | keyof ThemeColors
    | ((theme: ThemeColors) => string)
  hoverForegroundThemeColor?:
    | keyof ThemeColors
    | ((theme: ThemeColors) => string)
  href?: string
  mobileProps?: TouchableOpacityProps
  openOnNewTab?: boolean
  textProps?: ThemedTextProps
  tooltip?: string
  webProps?: AnchorHTMLAttributes<HTMLAnchorElement>
}

export function Link(props: LinkProps) {
  const {
    allowEmptyLink,
    analyticsLabel: _analyticsLabel,
    backgroundThemeColor,
    enableBackgroundHover,
    enableForegroundHover = true,
    enableTextWrapper,
    hoverBackgroundThemeColor: _hoverBackgroundThemeColor,
    hoverForegroundThemeColor: _hoverForegroundThemeColor,
    href,
    onPress,
    openOnNewTab: _openOnNewTab = true,
    textProps,
    tooltip,
    ...otherProps
  } = props

  const analyticsLabel = _analyticsLabel && _analyticsLabel.replace(/-/g, '_')

  const flatContainerStyle =
    StyleSheet.flatten([{ maxWidth: '100%' }, otherProps.style]) || EMPTY_OBJ

  const flatTextStyle =
    StyleSheet.flatten([textProps && textProps.style]) || EMPTY_OBJ

  const openOnNewTab = _openOnNewTab || Platform.isElectron

  const cacheRef = useRef({ isHovered: false })

  const theme = useTheme()

  const updateStyles = useCallback(() => {
    const { isHovered } = cacheRef.current

    const hoverBackgroundThemeColor = getThemeColorOrItself(
      theme,
      _hoverBackgroundThemeColor,
    )
    const hoverForegroundThemeColor = getThemeColorOrItself(
      theme,
      _hoverForegroundThemeColor,
    )

    if (containerRef.current) {
      const hoverBackgroundColor = enableBackgroundHover
        ? (hoverBackgroundThemeColor && hoverBackgroundThemeColor) ||
          rgba(theme.invert().foregroundColor, 0.2)
        : undefined

      const backgroundColor =
        (backgroundThemeColor &&
          getThemeColorOrItself(theme, backgroundThemeColor)) ||
        flatContainerStyle.backgroundColor

      containerRef.current!.setNativeProps({
        style: {
          backgroundColor:
            hoverBackgroundColor && isHovered
              ? hoverBackgroundColor
              : backgroundColor ||
                (hoverBackgroundColor ? rgba(hoverBackgroundColor, 0) : null),
        },
      })
    }

    if (textRef.current) {
      const hoverForegroundColor = enableForegroundHover
        ? (hoverForegroundThemeColor && hoverForegroundThemeColor) ||
          theme.primaryBackgroundColor
        : undefined

      const color =
        (textProps &&
          textProps.color &&
          getThemeColorOrItself(theme, textProps.color)) ||
        flatTextStyle.color

      textRef.current.setNativeProps({
        style: {
          color:
            hoverForegroundColor && isHovered
              ? hoverForegroundColor
              : color ||
                (hoverForegroundColor ? rgba(hoverForegroundColor, 0) : null),
        },
      })
    }
  }, [
    _hoverBackgroundThemeColor,
    _hoverForegroundThemeColor,
    backgroundThemeColor,
    enableBackgroundHover,
    enableForegroundHover,
    flatContainerStyle.backgroundColor,
    flatTextStyle.color,
    textProps && textProps.color,
    theme,
  ])

  const containerRef = useRef<View>(null)
  const textRef = useRef<Text>(null)
  const initialIsHovered = useHover(
    enableBackgroundHover || enableForegroundHover ? containerRef : null,
    useCallback(
      isHovered => {
        if (cacheRef.current.isHovered === isHovered) return
        cacheRef.current.isHovered = isHovered
        updateStyles()
      },
      [updateStyles],
    ),
  )
  cacheRef.current.isHovered = initialIsHovered

  const isFirstRendeRef = useRef(true)
  useLayoutEffect(() => {
    if (isFirstRendeRef.current) {
      isFirstRendeRef.current = false
      return
    }

    updateStyles()
  }, [updateStyles])

  useEffect(() => {
    if (!(Platform.realOS === 'web')) return
    const node = findNode(containerRef)
    if (!node) return

    node.title = tooltip || ''
    if (!tooltip && node.removeAttribute) node.removeAttribute('title')
  }, [containerRef.current, tooltip])

  const renderTouchable = href || onPress || allowEmptyLink

  let finalProps: any
  if (renderTouchable) {
    finalProps = {
      ...(analyticsLabel
        ? {
            analyticsCategory: 'link',
            analyticsAction: 'click',
            analyticsLabel,
          }
        : {}),
      ...Platform.select({
        default: {
          ...otherProps,
          onPress:
            onPress ||
            (href
              ? href.startsWith('http')
                ? () => Browser.openURL(href)
                : () => Linking.openURL(href)
              : undefined),
        } as any,

        web: {
          accessibilityRole: 'link',
          href,
          onPress,
          selectable: true,
          target: openOnNewTab ? '_blank' : '_self',
          ...otherProps,
        } as any,
      }),
      style: flatContainerStyle,
    }
  } else {
    finalProps = {
      ...otherProps,
      onPress,
      style: flatContainerStyle,
    }
  }

  if (
    (typeof finalProps.children === 'string' && enableTextWrapper !== false) ||
    (typeof finalProps.children !== 'string' && enableTextWrapper === true)
  ) {
    finalProps.children = (
      <ThemedText ref={textRef} {...textProps}>
        {finalProps.children}
      </ThemedText>
    )
  }

  if (!renderTouchable) return <ThemedView ref={containerRef} {...finalProps} />
  return <TouchableOpacity ref={containerRef} {...finalProps} />
}
