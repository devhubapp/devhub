import React, {
  AnchorHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Omit, ThemeColors } from '@devhub/core'
import { rgba } from 'polished'
import { useHover } from '../../hooks/use-hover'
import { Browser } from '../../libs/browser'
import { Linking } from '../../libs/linking'
import { Platform } from '../../libs/platform'
import { findNode } from '../../utils/helpers/shared'
import {
  SpringAnimatedText,
  SpringAnimatedTextProps,
} from '../animated/spring/SpringAnimatedText'
import {
  SpringAnimatedTouchableOpacity,
  SpringAnimatedTouchableOpacityProps,
} from '../animated/spring/SpringAnimatedTouchableOpacity'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { useTheme } from '../context/ThemeContext'

export interface LinkProps
  extends Omit<SpringAnimatedTouchableOpacityProps, 'analyticsLabel'> {
  allowEmptyLink?: boolean
  analyticsLabel?: SpringAnimatedTouchableOpacityProps['analyticsLabel']
  enableBackgroundHover?: boolean
  enableForegroundHover?: boolean
  enableTextWrapper?: boolean
  hoverBackgroundThemeColor?: keyof ThemeColors
  hoverForegroundThemeColor?: keyof ThemeColors
  href?: string
  mobileProps?: SpringAnimatedTouchableOpacityProps
  openOnNewTab?: boolean
  textProps?: SpringAnimatedTextProps
  tooltip?: string
  webProps?: AnchorHTMLAttributes<HTMLAnchorElement>
}

export function Link(props: LinkProps) {
  const {
    allowEmptyLink,
    analyticsLabel,
    enableBackgroundHover,
    enableForegroundHover = true,
    enableTextWrapper,
    hoverBackgroundThemeColor,
    hoverForegroundThemeColor,
    href,
    openOnNewTab: _openOnNewTab = true,
    textProps,
    tooltip,
    ...otherProps
  } = props

  const flatContainerStyle =
    StyleSheet.flatten([{ maxWidth: '100%' }, otherProps.style]) || {}

  const flatTextStyle = StyleSheet.flatten([textProps && textProps.style]) || {}

  const openOnNewTab = _openOnNewTab || Platform.isElectron

  const updateStyles = useCallback(() => {
    if (!(enableBackgroundHover || enableForegroundHover)) return

    const { isHovered, theme } = cacheRef.current

    if (containerRef.current) {
      const hoverBackgroundColor = enableBackgroundHover
        ? (hoverBackgroundThemeColor && theme[hoverBackgroundThemeColor]) ||
          rgba(theme.invert().foregroundColor, 0.2)
        : undefined

      containerRef.current!.setNativeProps({
        style: {
          backgroundColor:
            hoverBackgroundColor && isHovered
              ? hoverBackgroundColor
              : flatContainerStyle.backgroundColor ||
                (hoverBackgroundColor ? rgba(hoverBackgroundColor, 0) : null),
        },
      })
    }

    if (textRef.current) {
      const hoverForegroundColor = enableForegroundHover
        ? (hoverForegroundThemeColor && theme[hoverForegroundThemeColor]) ||
          theme.primaryBackgroundColor
        : undefined

      textRef.current.setNativeProps({
        style: {
          color:
            hoverForegroundColor && isHovered
              ? hoverForegroundColor
              : flatTextStyle.color ||
                (hoverForegroundColor ? rgba(hoverForegroundColor, 0) : null),
        },
      })
    }
  }, [
    enableBackgroundHover,
    enableForegroundHover,
    flatContainerStyle.backgroundColor,
    flatTextStyle.color,
    hoverBackgroundThemeColor,
    hoverForegroundThemeColor,
  ])

  const initialTheme = useTheme(
    useCallback(
      theme => {
        if (cacheRef.current.theme === theme) return
        cacheRef.current.theme = theme
        updateStyles()
      },
      [updateStyles],
    ),
  )

  const containerRef = useRef<View>(null)
  const textRef = useRef<Text>(null)
  useHover(
    enableBackgroundHover || enableForegroundHover ? containerRef : null,
    isHovered => {
      cacheRef.current.isHovered = isHovered
      updateStyles()
    },
  )

  useEffect(() => {
    if (!(Platform.realOS === 'web')) return
    const node = findNode(containerRef)
    if (!node) return

    node.title = tooltip || ''
  }, [containerRef.current, tooltip])

  const cacheRef = useRef({ theme: initialTheme, isHovered: false })
  cacheRef.current.theme = initialTheme

  const renderTouchable = href || otherProps.onPress || allowEmptyLink

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
          onPress: href
            ? href.startsWith('http')
              ? () => Browser.openURL(href)
              : () => Linking.openURL(href)
            : undefined,
          ...otherProps,
        } as any,

        web: {
          accessibilityRole: 'link',
          href,
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
      style: flatContainerStyle,
    }
  }

  if (
    (typeof finalProps.children === 'string' && enableTextWrapper !== false) ||
    (typeof finalProps.children !== 'string' && enableTextWrapper === true)
  ) {
    finalProps.children = (
      <SpringAnimatedText ref={textRef} {...textProps}>
        {finalProps.children}
      </SpringAnimatedText>
    )
  }

  if (!renderTouchable)
    return <SpringAnimatedView ref={containerRef} {...finalProps} />
  return <SpringAnimatedTouchableOpacity ref={containerRef} {...finalProps} />
}
