import React, { useRef } from 'react'
import { ImageStyle, StyleProp, TextStyle, View, ViewStyle } from 'react-native'

import { GitHubIcon } from '@devhub/core'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useHover } from '../../hooks/use-hover'
import { useReduxState } from '../../hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import * as colors from '../../styles/colors'
import {
  columnHeaderItemContentSize,
  contentPadding,
} from '../../styles/variables'
import { AnimatedIcon } from '../animated/AnimatedIcon'
import { AnimatedText } from '../animated/AnimatedText'
import { AnimatedView } from '../animated/AnimatedView'
import { Avatar, AvatarProps } from '../common/Avatar'
import {
  ConditionalWrap,
  ConditionalWrapProps,
} from '../common/ConditionalWrap'
import {
  TouchableOpacity,
  TouchableOpacityProps,
} from '../common/TouchableOpacity'

export interface ColumnHeaderItemProps {
  analyticsAction?: TouchableOpacityProps['analyticsAction']
  analyticsLabel?: TouchableOpacityProps['analyticsLabel']
  avatarProps?: Partial<AvatarProps>
  avatarStyle?: StyleProp<ImageStyle>
  children?: React.ReactNode
  disabled?: TouchableOpacityProps['disabled']
  enableBackgroundHover?: boolean
  enableForegroundHover?: boolean
  fixedIconSize?: boolean
  forceHoverState?: boolean
  hoverBackgroundColor?: string
  iconName?: GitHubIcon
  iconStyle?: StyleProp<TextStyle>
  label?: string
  noPadding?: boolean
  onPress?: TouchableOpacityProps['onPress']
  selectable?: boolean
  showLabel?: boolean
  size?: number
  style?: TouchableOpacityProps['style']
  subtitle?: string
  subtitleStyle?: StyleProp<TextStyle>
  text?: string
  title?: string
  titleStyle?: StyleProp<TextStyle>
}

export function ColumnHeaderItem(props: ColumnHeaderItemProps) {
  const {
    analyticsAction,
    analyticsLabel,
    avatarProps: _avatarProps,
    children,
    disabled,
    enableBackgroundHover,
    enableForegroundHover,
    fixedIconSize,
    forceHoverState,
    hoverBackgroundColor: _hoverBackgroundColor,
    iconName,
    iconStyle,
    label: _label,
    noPadding,
    onPress,
    selectable,
    showLabel,
    size = columnHeaderItemContentSize,
    style,
    subtitle,
    subtitleStyle,
    text,
    title,
    titleStyle,
  } = props

  const theme = useAnimatedTheme()
  const _username = useReduxState(selectors.currentUsernameSelector)

  const containerRef = useRef(null)
  const isHovered =
    useHover(
      !disabled && (enableBackgroundHover || enableForegroundHover)
        ? containerRef
        : null,
    ) || forceHoverState

  const avatarProps = _avatarProps || {}

  const label = `${_label || ''}`.trim().toLowerCase()

  const username =
    _username &&
    avatarProps.username &&
    _username.toLowerCase() === avatarProps.username.toLowerCase()
      ? undefined
      : avatarProps.username

  const hasText = !!(title || subtitle || text)

  const normalBackgroundColor = undefined
  const hoverBackgroundColor =
    _hoverBackgroundColor || theme.backgroundColorLess08

  const normalForegroundColor = theme.foregroundColor
  const hoverForegroundColor = colors.brandBackgroundColor

  const styles = {
    container: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    } as ViewStyle,

    mainContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
    } as ViewStyle,

    icon: {
      height: size,
      lineHeight: size,
      fontSize: size,
    } as TextStyle,

    title: {
      marginRight: contentPadding / 2,
      lineHeight: size,
      fontSize: size - 2,
    } as TextStyle,

    subtitle: {
      marginRight: contentPadding / 2,
      fontSize: size - 7,
    } as TextStyle,

    text: {} as TextStyle,
  }

  const wrap: ConditionalWrapProps['wrap'] = child =>
    onPress ? (
      <TouchableOpacity
        ref={containerRef}
        animated
        analyticsAction={analyticsAction}
        analyticsLabel={analyticsLabel}
        disabled={disabled}
        onPress={onPress}
        style={[
          styles.container,
          noPadding
            ? undefined
            : {
                paddingHorizontal: contentPadding / 2,
                paddingVertical:
                  showLabel && label ? undefined : contentPadding,
              },
          { backgroundColor: normalBackgroundColor },
          style,
          isHovered &&
            enableBackgroundHover && { backgroundColor: hoverBackgroundColor },
        ]}
      >
        {child}
      </TouchableOpacity>
    ) : (
      <AnimatedView
        ref={containerRef}
        style={[
          styles.container,
          noPadding
            ? undefined
            : {
                paddingHorizontal: contentPadding / 2,
                paddingVertical:
                  showLabel && label ? undefined : contentPadding,
              },
          style,
          { backgroundColor: normalBackgroundColor },
          style,
          isHovered &&
            enableBackgroundHover && { backgroundColor: hoverBackgroundColor },
        ]}
      >
        {child}
      </AnimatedView>
    )

  return (
    <ConditionalWrap condition wrap={wrap}>
      <>
        <View style={styles.mainContainer}>
          {(!!iconName || !!username) && (
            <View
              style={{
                position: 'relative',
                alignSelf: 'center',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: hasText ? 8 : 0,
              }}
            >
              {!!username ? (
                <Avatar
                  isBot={false}
                  linkURL=""
                  {...avatarProps}
                  style={[
                    {
                      width: size,
                      height: size,
                    },
                    avatarProps.style,
                  ]}
                  username={username}
                />
              ) : (
                !!iconName && (
                  <AnimatedIcon
                    name={iconName}
                    style={[
                      styles.icon,
                      fixedIconSize && {
                        width: size,
                      },
                      { color: normalForegroundColor },
                      iconStyle,
                      isHovered &&
                        enableForegroundHover && {
                          color: hoverForegroundColor,
                        },
                    ]}
                  />
                )
              )}
            </View>
          )}

          <View style={{ flexDirection: 'row', maxWidth: 170 }}>
            {!!title && (
              <AnimatedText
                numberOfLines={1}
                selectable={selectable}
                style={[
                  styles.title,
                  { color: normalForegroundColor },
                  titleStyle,
                  isHovered &&
                    enableForegroundHover && {
                      color: hoverForegroundColor,
                    },
                ]}
              >
                {title.toLowerCase()}
              </AnimatedText>
            )}
          </View>

          {!!subtitle && (
            <AnimatedText
              numberOfLines={1}
              selectable={selectable}
              style={[
                styles.subtitle,
                { color: theme.foregroundColorMuted50 },
                subtitleStyle,
              ]}
            >
              {subtitle.toLowerCase()}
            </AnimatedText>
          )}

          {!!text && (
            <AnimatedText
              numberOfLines={1}
              selectable={selectable}
              style={[
                styles.text,
                { color: normalForegroundColor },
                isHovered &&
                  enableForegroundHover && {
                    color: hoverForegroundColor,
                  },
              ]}
            >
              {text}
            </AnimatedText>
          )}
        </View>

        {!!showLabel && !!label && (
          <AnimatedText
            style={[
              {
                width: Math.max(54, size + contentPadding),
                marginHorizontal: 2,
                marginTop: 3,
                letterSpacing: -0.5,
                fontSize: 10,
                textAlign: 'center',
              },

              { color: normalForegroundColor },
              style,
              isHovered &&
                enableForegroundHover && {
                  color: hoverForegroundColor,
                },
            ]}
            numberOfLines={1}
          >
            {label}
          </AnimatedText>
        )}

        {children}
      </>
    </ConditionalWrap>
  )
}
