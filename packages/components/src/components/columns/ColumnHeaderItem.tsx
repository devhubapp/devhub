import { rgba } from 'polished'
import React, { useCallback, useLayoutEffect, useRef } from 'react'
import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { useSpring } from 'react-spring/native'

import { constants, GitHubIcon, ThemeColors } from '@devhub/core'
import { useHover } from '../../hooks/use-hover'
import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as selectors from '../../redux/selectors'
import {
  columnHeaderItemContentSize,
  contentPadding,
} from '../../styles/variables'
import { getDefaultReactSpringAnimationConfig } from '../../utils/helpers/animations'
import { findNode } from '../../utils/helpers/shared'
import { SpringAnimatedIcon } from '../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { SpringAnimatedTouchableOpacity } from '../animated/spring/SpringAnimatedTouchableOpacity'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { Avatar, AvatarProps } from '../common/Avatar'
import {
  ConditionalWrap,
  ConditionalWrapProps,
} from '../common/ConditionalWrap'
import { TouchableOpacityProps } from '../common/TouchableOpacity'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from '../themed/helpers'
import { ThemedView } from '../themed/ThemedView'

export interface ColumnHeaderItemProps {
  activeOpacity?: TouchableOpacityProps['activeOpacity']
  analyticsAction?: TouchableOpacityProps['analyticsAction']
  analyticsLabel?: TouchableOpacityProps['analyticsLabel']
  avatarProps?: Partial<AvatarProps>
  avatarStyle?: StyleProp<ImageStyle>
  backgroundThemeColor?:
    | keyof ThemeColors
    | ((theme: ThemeColors) => string)
    | string
  children?: React.ReactNode
  disabled?: TouchableOpacityProps['disabled']
  enableBackgroundHover?: boolean
  enableForegroundHover?: boolean
  fixedIconSize?: boolean
  forceHoverState?: boolean
  foregroundThemeColor?:
    | keyof ThemeColors
    | ((theme: ThemeColors) => string)
    | string
  hoverBackgroundThemeColor?:
    | keyof ThemeColors
    | ((theme: ThemeColors) => string)
  hoverForegroundThemeColor?:
    | keyof ThemeColors
    | ((theme: ThemeColors) => string)
  iconName?: GitHubIcon
  iconStyle?: StyleProp<TextStyle>
  isUnread?: boolean
  label?: string
  mainContainerStyle?: StyleProp<ViewStyle>
  noPadding?: boolean
  onPress?: TouchableOpacityProps['onPress']
  selectable?: boolean
  showLabel?: boolean
  size?: number
  style?: TouchableOpacityProps['style']
  subtitle?: string
  subtitleStyle?: StyleProp<TextStyle>
  text?: string
  textStyle?: StyleProp<TextStyle>
  title?: string
  titleStyle?: StyleProp<TextStyle>
  tooltip: string | undefined
}

export const ColumnHeaderItem = React.memo((props: ColumnHeaderItemProps) => {
  const {
    activeOpacity = Platform.realOS !== 'web' && props.enableBackgroundHover
      ? 1
      : undefined,
    analyticsAction,
    analyticsLabel,
    avatarProps: _avatarProps,
    backgroundThemeColor,
    children,
    disabled,
    enableBackgroundHover,
    enableForegroundHover,
    fixedIconSize,
    forceHoverState,
    foregroundThemeColor,
    hoverBackgroundThemeColor = 'backgroundColorLess1',
    hoverForegroundThemeColor,
    iconName,
    iconStyle,
    isUnread,
    label: _label,
    mainContainerStyle,
    noPadding,
    onPress,
    selectable,
    showLabel,
    size = columnHeaderItemContentSize,
    style,
    subtitle,
    subtitleStyle,
    text,
    textStyle,
    title,
    titleStyle,
    tooltip,
  } = props

  const getStyles = useCallback(
    ({ forceImmediate }: { forceImmediate?: boolean } = {}) => {
      const { isHovered: _isHovered, theme } = cacheRef.current

      const backgroundColor = getThemeColorOrItself(theme, backgroundThemeColor)
      const foregroundColor = getThemeColorOrItself(theme, foregroundThemeColor)

      const hoverBackgroundColor = getThemeColorOrItself(
        theme,
        hoverBackgroundThemeColor,
      )
      const hoverForegroundColor = getThemeColorOrItself(
        theme,
        hoverForegroundThemeColor,
      )

      const isHovered = (_isHovered || forceHoverState) && !disabled
      const immediate =
        constants.DISABLE_ANIMATIONS ||
        forceImmediate ||
        isHovered ||
        !!(enableForegroundHover && !enableBackgroundHover) ||
        (Platform.OS === 'web' && Platform.realOS !== 'web')

      return {
        config: getDefaultReactSpringAnimationConfig(),
        immediate,
        backgroundColor:
          isHovered && enableBackgroundHover
            ? hoverBackgroundColor || 'transparent'
            : rgba(backgroundColor || theme.backgroundColor, 0),
        foregroundColor:
          isHovered && enableForegroundHover
            ? hoverForegroundColor || theme.primaryBackgroundColor
            : foregroundColor || theme.foregroundColor,
        mutedForegroundColor: theme.foregroundColorMuted60,
      }
    },
    [
      backgroundThemeColor,
      disabled,
      enableBackgroundHover,
      enableForegroundHover,
      forceHoverState,
      foregroundThemeColor,
      hoverBackgroundThemeColor,
      hoverForegroundThemeColor,
    ],
  )

  const updateStyles = useCallback(
    ({ forceImmediate }: { forceImmediate?: boolean }) => {
      setSpringAnimatedStyles(getStyles({ forceImmediate }))
    },
    [getStyles],
  )

  const initialTheme = useTheme(
    undefined,
    useCallback(
      theme => {
        if (cacheRef.current.theme === theme) return
        cacheRef.current.theme = theme
        updateStyles({ forceImmediate: true })
      },
      [updateStyles],
    ),
  )

  const containerRef = useRef<View>(null)
  useHover(
    enableBackgroundHover || enableForegroundHover ? containerRef : null,
    isHovered => {
      cacheRef.current.isHovered = isHovered
      updateStyles({ forceImmediate: false })
    },
  )

  const cacheRef = useRef({ isHovered: false, theme: initialTheme })
  cacheRef.current.theme = initialTheme

  const [springAnimatedStyles, setSpringAnimatedStyles] = useSpring(getStyles)

  useLayoutEffect(() => {
    updateStyles({ forceImmediate: false })
  }, [updateStyles])

  useLayoutEffect(() => {
    if (!(Platform.realOS === 'web' && !onPress)) return
    const node = findNode(containerRef)
    if (!node) return

    node.title = tooltip || ''
    if (!tooltip && node.removeAttribute) node.removeAttribute('title')
  }, [containerRef.current, tooltip])

  const _username = useReduxState(selectors.currentGitHubUsernameSelector)

  const avatarProps = _avatarProps || {}

  const label = `${_label || ''}`.trim()

  const username =
    _username &&
    avatarProps.username &&
    _username.toLowerCase() === avatarProps.username.toLowerCase()
      ? undefined
      : avatarProps.username

  const hasText = !!(title || subtitle || text)

  const styles = {
    container: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      overflow: 'hidden',
    } as ViewStyle,

    mainContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
    } as ViewStyle,

    icon: {
      fontSize: size,
      textAlign: 'center',
    } as TextStyle,

    title: {
      fontWeight: '800',
      marginRight: contentPadding / 2,
      lineHeight: size,
      fontSize: size - 1,
    } as TextStyle,

    subtitle: {
      marginRight: contentPadding / 2,
      fontSize: size - 5,
    } as TextStyle,

    text: {} as TextStyle,
  }

  const _wrapperStyle = StyleSheet.flatten([
    styles.container,
    noPadding
      ? undefined
      : {
          paddingHorizontal: contentPadding / 3,
          paddingVertical: showLabel ? undefined : contentPadding,
        },
    style,
    { backgroundColor: springAnimatedStyles.backgroundColor },
  ])

  const { opacity, ...wrapperStyle } = _wrapperStyle

  const wrap: ConditionalWrapProps['wrap'] = child =>
    onPress ? (
      <SpringAnimatedTouchableOpacity
        ref={containerRef}
        activeOpacity={activeOpacity}
        analyticsAction={analyticsAction}
        analyticsLabel={analyticsLabel}
        disabled={disabled}
        onPress={onPress}
        selectable={!onPress}
        style={wrapperStyle}
        tooltip={tooltip}
      >
        {child}
      </SpringAnimatedTouchableOpacity>
    ) : (
      <SpringAnimatedView ref={containerRef} style={wrapperStyle}>
        {child}
      </SpringAnimatedView>
    )

  return (
    <ConditionalWrap condition wrap={wrap}>
      <>
        <View style={[styles.mainContainer, { opacity }, mainContainerStyle]}>
          {(!!iconName || !!username) && (
            <View
              style={{
                position: 'relative',
                alignSelf: 'center',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: hasText ? contentPadding / 2 : 0,
              }}
            >
              {isUnread && (
                <ThemedView
                  backgroundColor="primaryBackgroundColor"
                  style={{
                    position: 'absolute',
                    right: contentPadding - (3 / 2) * size,
                    width: 7,
                    height: 7,
                    borderRadius: 4,
                  }}
                />
              )}
              {!!username ? (
                <Avatar
                  isBot={false}
                  linkURL=""
                  size={size}
                  tooltip={tooltip ? '' : undefined}
                  {...avatarProps}
                  username={username}
                />
              ) : (
                !!iconName && (
                  <SpringAnimatedIcon
                    name={iconName}
                    selectable={false}
                    style={[
                      styles.icon,
                      fixedIconSize && {
                        width: size,
                      },
                      iconStyle,
                      { color: springAnimatedStyles.foregroundColor },
                    ]}
                  />
                )
              )}
            </View>
          )}

          {!!title && (
            <SpringAnimatedText
              numberOfLines={1}
              selectable={selectable}
              style={[
                styles.title,
                titleStyle,
                {
                  color: springAnimatedStyles.foregroundColor,
                },
              ]}
            >
              {title}
            </SpringAnimatedText>
          )}

          {!!subtitle && (
            <SpringAnimatedText
              numberOfLines={1}
              selectable={selectable}
              style={[
                styles.subtitle,
                subtitleStyle,
                { color: springAnimatedStyles.mutedForegroundColor },
              ]}
            >
              {subtitle}
            </SpringAnimatedText>
          )}

          {!!text && (
            <SpringAnimatedText
              numberOfLines={1}
              selectable={selectable}
              style={[
                styles.text,
                textStyle,
                { color: springAnimatedStyles.foregroundColor },
              ]}
            >
              {text}
            </SpringAnimatedText>
          )}
        </View>

        {!!showLabel && (
          <SpringAnimatedText
            style={[
              {
                width: Math.max(54, size + contentPadding),
                marginHorizontal: 2,
                marginTop: 3,
                letterSpacing: -0.5,
                fontSize: 10,
                textAlign: 'center',
                opacity,
              },
              { color: springAnimatedStyles.foregroundColor },
            ]}
            numberOfLines={1}
          >
            {label || '?'}
          </SpringAnimatedText>
        )}

        {children}
      </>
    </ConditionalWrap>
  )
})

ColumnHeaderItem.displayName = 'ColumnHeaderItem'
