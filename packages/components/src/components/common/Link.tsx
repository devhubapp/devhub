import React, {
  AnchorHTMLAttributes,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Theme, ThemeColors } from '@devhub/core'
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
import { TouchableOpacity, TouchableOpacityProps } from './TouchableOpacity'

export interface LinkProps
  extends Omit<TouchableOpacityProps, 'analyticsLabel'> {
  allowEmptyLink?: boolean
  analyticsLabel?: TouchableOpacityProps['analyticsLabel']
  backgroundThemeColor?: keyof ThemeColors | ((theme: Theme) => string)
  enableBackgroundHover?: boolean
  enableForegroundHover?: boolean
  enableTextWrapper?: boolean
  hoverBackgroundThemeColor?: keyof ThemeColors | ((theme: Theme) => string)
  hoverForegroundThemeColor?: keyof ThemeColors | ((theme: Theme) => string)
  href?: string
  mobileProps?: TouchableOpacityProps
  openOnNewTab?: boolean
  textProps?: ThemedTextProps
  tooltip?: string
  webProps?: AnchorHTMLAttributes<HTMLAnchorElement>
}

export const Link = React.forwardRef<TouchableOpacity, LinkProps>(
  (props, ref) => {
    const {
      allowEmptyLink,
      analyticsLabel: _analyticsLabel,
      backgroundThemeColor,
      enableBackgroundHover,
      enableForegroundHover,
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
    const openOnNewTab = _openOnNewTab || Platform.isElectron

    const theme = useTheme()
    const cacheRef = useRef({ isHovered: false })

    const _flatContainerStyle =
      StyleSheet.flatten(otherProps.style) || EMPTY_OBJ

    const _flatTextStyle =
      StyleSheet.flatten(textProps && textProps.style) || EMPTY_OBJ

    const backgroundColor =
      (backgroundThemeColor &&
        getThemeColorOrItself(theme, backgroundThemeColor)) ||
      _flatContainerStyle.backgroundColor

    const color =
      (textProps &&
        textProps.color &&
        getThemeColorOrItself(theme, textProps.color)) ||
      _flatTextStyle.color

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
          },
        })
      }
    }, [
      _hoverBackgroundThemeColor,
      _hoverForegroundThemeColor,
      backgroundThemeColor,
      enableBackgroundHover,
      enableForegroundHover,
      backgroundColor,
      color,
      textProps && textProps.color,
      theme,
    ])

    const _defaultRef = useRef<View>(null)
    const containerRef = (ref as any) || _defaultRef
    const textRef = useRef<Text | null>(null)
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
              ? (e: any) => {
                  if (onPress) onPress(e)

                  if (href.startsWith('http')) Browser.openURL(href)
                  else Linking.openURL(href)
                }
              : onPress,
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
        style: [
          sharedStyles.fullMaxWidth,
          otherProps.style,
          { backgroundColor },
        ],
      }
    } else {
      finalProps = {
        ...otherProps,
        onPress,
        style: [
          sharedStyles.fullMaxWidth,
          otherProps.style,
          { backgroundColor },
        ],
      }
    }

    if (
      (typeof finalProps.children === 'string' &&
        enableTextWrapper !== false) ||
      (typeof finalProps.children !== 'string' && enableTextWrapper === true)
    ) {
      finalProps.children = (
        <ThemedText ref={textRef} {...textProps} color={color as any}>
          {finalProps.children}
        </ThemedText>
      )
    }

    if (!renderTouchable)
      return <ThemedView ref={containerRef} {...finalProps} />

    return <TouchableOpacity ref={containerRef} {...finalProps} />
  },
)
