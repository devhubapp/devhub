import { constants, Theme, ThemeColors } from '@devhub/core'
import React, {
  AnchorHTMLAttributes,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import { GestureResponderEvent, StyleSheet, Text, View } from 'react-native'

import { useHover } from '../../hooks/use-hover'
import { Browser } from '../../libs/browser'
import { Linking } from '../../libs/linking'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { EMPTY_OBJ } from '../../utils/constants'
import { findNode } from '../../utils/helpers/shared'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from '../themed/helpers'
import { ThemedText, ThemedTextProps } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'
import { Touchable, TouchableProps } from './Touchable'
import { TouchableOpacity } from './TouchableOpacity'

export interface LinkProps extends Partial<TouchableProps> {
  allowEmptyLink?: boolean
  backgroundThemeColor?: keyof ThemeColors | ((theme: Theme) => string)
  enableBackgroundHover?: boolean
  enableForegroundHover?: boolean
  enableUnderlineHover?: boolean
  enableTextWrapper?: boolean
  hoverBackgroundThemeColor?: keyof ThemeColors | ((theme: Theme) => string)
  hoverForegroundThemeColor?: keyof ThemeColors | ((theme: Theme) => string)
  href?: string
  mobileProps?: TouchableProps
  openOnNewTab?: boolean
  textProps?: ThemedTextProps
  tooltip?: string
  webProps?: AnchorHTMLAttributes<HTMLAnchorElement>
}

export const Link = React.forwardRef<Touchable, LinkProps>((props, ref) => {
  const {
    TouchableComponent,
    allowEmptyLink,
    analyticsLabel: _analyticsLabel,
    backgroundThemeColor,
    enableBackgroundHover,
    enableForegroundHover,
    enableUnderlineHover,
    enableTextWrapper,
    hoverBackgroundThemeColor: _hoverBackgroundThemeColor,
    hoverForegroundThemeColor: _hoverForegroundThemeColor,
    href,
    onPress,
    textProps,
    tooltip,
    ...otherProps
  } = props

  const {
    openOnNewTab: _openOnNewTab = !(href && href.startsWith('javascript:')),
  } = props

  const analyticsLabel = _analyticsLabel && _analyticsLabel.replace(/-/g, '_')
  const openOnNewTab = _openOnNewTab || Platform.isElectron

  const theme = useTheme()
  const cacheRef = useRef({ isHovered: false })

  const _flatContainerStyle = StyleSheet.flatten(otherProps.style) || EMPTY_OBJ

  const backgroundColor =
    (backgroundThemeColor &&
      getThemeColorOrItself(theme, backgroundThemeColor)) ||
    _flatContainerStyle.backgroundColor

  const color =
    textProps &&
    textProps.color &&
    getThemeColorOrItself(theme, textProps.color)

  const updateStyles = useCallback(() => {
    const { isHovered } = cacheRef.current

    const hoverBackgroundColor = enableBackgroundHover
      ? getThemeColorOrItself(
          theme,
          _hoverBackgroundThemeColor || 'foregroundColorTransparent10',
        )
      : undefined

    const hoverForegroundColor = enableForegroundHover
      ? getThemeColorOrItself(
          theme,
          _hoverForegroundThemeColor || 'primaryBackgroundColor',
        )
      : undefined

    if (containerRef.current) {
      containerRef.current!.setNativeProps({
        style: {
          backgroundColor:
            (isHovered && hoverBackgroundColor) || backgroundColor,
        },
      })
    }

    if (textRef.current) {
      textRef.current.setNativeProps({
        style: {
          color: (isHovered && hoverForegroundColor) || color,
          ...(enableUnderlineHover
            ? { textDecorationLine: isHovered ? 'underline' : 'none' }
            : {}),
        },
      })
    }
  }, [
    _hoverBackgroundThemeColor,
    _hoverForegroundThemeColor,
    backgroundThemeColor,
    enableBackgroundHover,
    enableForegroundHover,
    enableUnderlineHover,
    backgroundColor,
    color,
    textProps && textProps.color,
    theme,
  ])

  const _defaultRef = useRef<View>(null)
  const containerRef = (ref as any) || _defaultRef
  const textRef = useRef<Text | null>(null)
  const initialIsHovered = useHover(
    enableBackgroundHover || enableForegroundHover || enableUnderlineHover
      ? containerRef
      : null,
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

  useEffect(() => {
    return () => {
      textRef.current = null
    }
  }, [])

  const isFirstRendeRef = useRef(true)
  useLayoutEffect(() => {
    if (isFirstRendeRef.current) {
      isFirstRendeRef.current = false
      return
    }

    updateStyles()
  }, [updateStyles])

  useEffect(() => {
    if (!(Platform.OS === 'web' && !Platform.supportsTouch)) return

    const node = findNode(containerRef)
    if (!node) return

    node.title = tooltip || ''
    if (!tooltip && node.removeAttribute) node.removeAttribute('title')
  }, [containerRef.current, tooltip])

  const renderTouchable = href || onPress || allowEmptyLink

  const isDeepLink =
    href && href.startsWith(`${constants.APP_DEEP_LINK_SCHEMA}://`)

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
          onPress: href
            ? (e: GestureResponderEvent) => {
                if (onPress) onPress(e)
                if (e && e.isDefaultPrevented()) return

                if (href.startsWith('http')) Browser.openURL(href)
                else if (!href.startsWith('javascript:')) Linking.openURL(href)

                if (e) e.preventDefault()
              }
            : onPress,
        } as any,

        web: {
          accessibilityRole: href && !isDeepLink ? 'link' : 'button',
          href: isDeepLink ? undefined : href,
          onPress: href
            ? (e: any) => {
                if (onPress) onPress(e)
                if (e && e.isDefaultPrevented()) return

                if (isDeepLink && href) Linking.openURL(href)

                if (e) e.preventDefault()
              }
            : onPress,
          selectable: true,
          target: openOnNewTab ? '_blank' : '_self',
          ...otherProps,
        } as any,
      }),
      style: [sharedStyles.fullMaxWidth, otherProps.style, { backgroundColor }],
    }
  } else {
    finalProps = {
      ...otherProps,
      onPress,
      style: [sharedStyles.fullMaxWidth, otherProps.style, { backgroundColor }],
    }
  }

  if (
    (typeof finalProps.children === 'string' && enableTextWrapper !== false) ||
    (typeof finalProps.children !== 'string' && enableTextWrapper === true)
  ) {
    finalProps.children = (
      <ThemedText ref={textRef} {...textProps} color={color as any}>
        {finalProps.children}
      </ThemedText>
    )
  }

  if (!renderTouchable) return <ThemedView ref={containerRef} {...finalProps} />

  return (
    <Touchable
      ref={containerRef}
      {...finalProps}
      TouchableComponent={TouchableComponent || TouchableOpacity}
    />
  )
})

export type Link = ThemedView | ThemedText | Touchable
