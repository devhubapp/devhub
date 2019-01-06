import React from 'react'
import {
  Animated,
  ImageStyle,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

import { GitHubIcon } from '@devhub/core'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useReduxState } from '../../redux/hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import {
  columnHeaderItemContentBiggerSize,
  columnHeaderItemContentSize,
  contentPadding,
} from '../../styles/variables'
import { AnimatedIcon } from '../animated/AnimatedIcon'
import { Avatar, AvatarProps } from '../common/Avatar'
import {
  ConditionalWrap,
  ConditionalWrapProps,
} from '../common/ConditionalWrap'
import { Spacer } from '../common/Spacer'
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
  fixedIconSize?: boolean
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
  const theme = useAnimatedTheme()
  const _username = useReduxState(selectors.currentUsernameSelector)

  const {
    analyticsAction,
    analyticsLabel,
    avatarProps: _avatarProps,
    children,
    disabled,
    fixedIconSize,
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

  const avatarProps = _avatarProps || {}

  const label = `${_label || ''}`.trim().toLowerCase()

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
    } as ViewStyle,

    mainContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
    } as ViewStyle,

    icon: {
      height: size,
      fontSize: size,
    } as TextStyle,

    title: {
      fontSize: size - 2,
    } as TextStyle,

    subtitle: {
      fontSize: size - 7,
    } as TextStyle,

    text: {} as TextStyle,
  }

  const wrap: ConditionalWrapProps['wrap'] = child =>
    onPress ? (
      <TouchableOpacity
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
          style,
        ]}
      >
        {child}
      </TouchableOpacity>
    ) : (
      <View
        style={[
          styles.container,
          noPadding
            ? undefined
            : {
                paddingHorizontal: contentPadding / 2,
                paddingVertical:
                  showLabel && label ? undefined : contentPadding,
              },
          ,
          style,
        ]}
      >
        {child}
      </View>
    )

  return (
    <ConditionalWrap condition wrap={wrap}>
      <>
        <View style={styles.mainContainer}>
          {(!!iconName || !!username) && (
            <View
              style={{
                position: 'relative',
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
                    color={theme.foregroundColor}
                    selectable={selectable}
                    name={iconName}
                    style={[
                      styles.icon,
                      fixedIconSize && {
                        width: size,
                      },
                      iconStyle,
                    ]}
                  />
                )
              )}
            </View>
          )}
          {hasText && (
            <Animated.Text
              numberOfLines={1}
              selectable={selectable}
              style={[{ color: theme.foregroundColorMuted50 }]}
            >
              {!!title && (
                <Animated.Text
                  selectable={selectable}
                  style={[
                    styles.title,
                    { color: theme.foregroundColor },
                    titleStyle,
                  ]}
                >
                  {title.toLowerCase()}
                  {!!subtitle && '  '}
                </Animated.Text>
              )}

              {!!subtitle && (
                <Animated.Text
                  selectable={selectable}
                  style={[
                    styles.subtitle,
                    { color: theme.foregroundColorMuted50 },
                    subtitleStyle,
                  ]}
                >
                  {subtitle.toLowerCase()}
                </Animated.Text>
              )}

              {!!text && (
                <Animated.Text
                  selectable={selectable}
                  style={[styles.text, { color: theme.foregroundColor }]}
                >
                  {text}
                </Animated.Text>
              )}
            </Animated.Text>
          )}
        </View>

        {!!showLabel && !!label && (
          <Animated.Text
            style={{
              width: Math.max(54, size + contentPadding),
              marginHorizontal: 2,
              marginTop: 3,
              letterSpacing: -0.5,
              fontSize: 10,
              color: theme.foregroundColor,
              textAlign: 'center',
            }}
            numberOfLines={1}
          >
            {label}
          </Animated.Text>
        )}

        {children}
      </>
    </ConditionalWrap>
  )
}
