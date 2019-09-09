import { rgba } from 'polished'
import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { useSpring } from 'react-spring/native'

import { constants, GitHubIcon, Theme, ThemeColors } from '@devhub/core'
import { useHover } from '../../hooks/use-hover'
import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as selectors from '../../redux/selectors'
import {
  columnHeaderItemContentSize,
  contentPadding,
} from '../../styles/variables'
import { EMPTY_OBJ } from '../../utils/constants'
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

export interface ColumnHeaderItemProps {
  activeOpacity?: TouchableOpacityProps['activeOpacity']
  analyticsAction?: TouchableOpacityProps['analyticsAction']
  analyticsLabel?: TouchableOpacityProps['analyticsLabel']
  avatarProps?: Partial<AvatarProps>
  avatarStyle?: StyleProp<ImageStyle>
  backgroundThemeColor?: keyof ThemeColors | ((theme: Theme) => string) | string
  children?: React.ReactNode
  disabled?: TouchableOpacityProps['disabled']
  enableBackgroundHover?: boolean
  enableForegroundHover?: boolean
  fixedIconSize?: boolean
  forceHoverState?: boolean
  foregroundThemeColor?: keyof ThemeColors | ((theme: Theme) => string) | string
  hoverBackgroundThemeColor?: keyof ThemeColors | ((theme: Theme) => string)
  hoverForegroundThemeColor?: keyof ThemeColors | ((theme: Theme) => string)
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
  unreadIndicatorBackgroundThemeColor?:
    | keyof ThemeColors
    | ((theme: Theme) => string)
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    overflow: 'hidden',
  },

  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },

  innerContainer: {
    position: 'relative',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    textAlign: 'center',
  },

  title: {
    fontWeight: '800',
    marginRight: contentPadding / 2,
  },

  subtitle: {
    marginRight: contentPadding / 2,
  },

  text: {},

  labelText: {
    marginHorizontal: 2,
    marginTop: 3,
    letterSpacing: -0.5,
    fontSize: 10,
    textAlign: 'center',
  },

  dotIndicator: {
    position: 'absolute',
    right: -7,
    width: 12,
    height: 12,
    borderWidth: 2,
    borderRadius: 12 / 2,
    zIndex: 1,
  },
})

export const ColumnHeaderItem = React.memo((props: ColumnHeaderItemProps) => {
  const {
    activeOpacity = !Platform.supportsTouch && props.enableBackgroundHover
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
    style: _style,
    subtitle,
    subtitleStyle,
    text,
    textStyle,
    title,
    titleStyle,
    tooltip,
    unreadIndicatorBackgroundThemeColor = 'primaryBackgroundColor',
  } = props

  const theme = useTheme()

  const cacheRef = useRef({ isHovered: false })

  const getStyles = useCallback(
    ({ forceImmediate }: { forceImmediate?: boolean } = {}) => {
      const { isHovered: _isHovered } = cacheRef.current

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

      const unreadIndicatorBackgroundColor = getThemeColorOrItself(
        theme,
        unreadIndicatorBackgroundThemeColor,
      )

      const isHovered = (_isHovered || forceHoverState) && !disabled
      const immediate =
        constants.DISABLE_ANIMATIONS ||
        forceImmediate ||
        isHovered ||
        !!(enableForegroundHover && !enableBackgroundHover) ||
        Platform.supportsTouch

      return {
        config: getDefaultReactSpringAnimationConfig(),
        immediate,
        backgroundColor:
          isHovered && enableBackgroundHover
            ? hoverBackgroundColor || 'transparent'
            : rgba(backgroundColor || theme.backgroundColor, 0),
        backgroundColorWithoutTransparency:
          isHovered && enableBackgroundHover
            ? hoverBackgroundColor || 'transparent'
            : backgroundColor || theme.backgroundColor,
        foregroundColor:
          isHovered && enableForegroundHover
            ? hoverForegroundColor || theme.primaryBackgroundColor
            : foregroundColor || theme.foregroundColor,
        mutedForegroundColor: theme.foregroundColorMuted65,
        primaryBackgroundColor: theme.primaryBackgroundColor,
        unreadIndicatorBackgroundColor,
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
      theme,
    ],
  )

  const [springAnimatedStyles, setSpringAnimatedStyles] = useSpring(getStyles)

  const updateStyles = useCallback(
    ({ forceImmediate }: { forceImmediate?: boolean }) => {
      setSpringAnimatedStyles(getStyles({ forceImmediate }))
    },
    [getStyles],
  )

  const containerRef = useRef<View>(null)
  const initialIsHovered = useHover(
    enableBackgroundHover || enableForegroundHover ? containerRef : null,
    isHovered => {
      if (cacheRef.current.isHovered === isHovered) return
      cacheRef.current.isHovered = isHovered
      updateStyles({ forceImmediate: false })
    },
  )
  cacheRef.current.isHovered = initialIsHovered

  const isFirstRendeRef = useRef(true)
  useLayoutEffect(() => {
    if (isFirstRendeRef.current) {
      isFirstRendeRef.current = false
      return
    }

    updateStyles({ forceImmediate: true })
  }, [updateStyles])

  useEffect(() => {
    if (!(Platform.OS === 'web' && !Platform.supportsTouch)) return
    const node = findNode(containerRef)
    if (!node) return

    node.title = tooltip || ''
    if (!tooltip && node.removeAttribute) node.removeAttribute('title')
  }, [containerRef.current, tooltip])

  const currentLoggedUsername = useReduxState(
    selectors.currentGitHubUsernameSelector,
  )

  const avatarProps = _avatarProps || (EMPTY_OBJ as Partial<AvatarProps>)

  const label = `${_label || ''}`.trim()

  const username =
    currentLoggedUsername &&
    avatarProps.username &&
    currentLoggedUsername.toLowerCase() === avatarProps.username.toLowerCase()
      ? undefined
      : avatarProps.username

  const hasText = !!(title || subtitle || text)

  const { opacity, ...style } = StyleSheet.flatten(_style || {})

  const wrapperStyle = [
    styles.container,
    noPadding
      ? undefined
      : {
          paddingHorizontal: contentPadding / 3,
          paddingVertical: showLabel ? undefined : contentPadding,
        },
    style,
    { backgroundColor: springAnimatedStyles.backgroundColor },
  ]

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
              style={[
                styles.innerContainer,
                {
                  marginRight: hasText ? contentPadding / 2 : 0,
                },
              ]}
            >
              {!!isUnread && (
                <SpringAnimatedView
                  style={[
                    styles.dotIndicator,
                    {
                      ...(showLabel ? { top: -2 } : { bottom: -3 }),
                      backgroundColor:
                        springAnimatedStyles.unreadIndicatorBackgroundColor,
                      borderColor:
                        springAnimatedStyles.backgroundColorWithoutTransparency,
                    },
                  ]}
                />
              )}

              {!!(username || (avatarProps && avatarProps.avatarUrl)) ? (
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
                      {
                        fontSize: size,
                        color: springAnimatedStyles.foregroundColor,
                      },
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
                  lineHeight: size,
                  fontSize: size - 1,
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
                {
                  fontSize: size - 5,
                  color: springAnimatedStyles.mutedForegroundColor,
                },
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
              styles.labelText,
              {
                width: Math.max(54, size + contentPadding),
                color: springAnimatedStyles.foregroundColor,
                opacity,
              },
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
