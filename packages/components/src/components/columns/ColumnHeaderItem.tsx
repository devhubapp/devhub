import React from 'react'
import {
  Animated,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

import { GitHubIcon } from '@devhub/core/src/types'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useReduxState } from '../../redux/hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import {
  columnHeaderItemContentSize,
  contentPadding,
} from '../../styles/variables'
import { AnimatedIcon } from '../animated/AnimatedIcon'
import { Avatar, AvatarProps } from '../common/Avatar'
import {
  ConditionalWrap,
  ConditionalWrapProps,
} from '../common/ConditionalWrap'

export interface ColumnHeaderItemProps {
  avatarProps?: Partial<AvatarProps>
  avatarStyle?: StyleProp<ImageStyle>
  children?: React.ReactNode
  fixedIconSize?: boolean
  iconName?: GitHubIcon
  iconStyle?: StyleProp<TextStyle>
  noPadding?: boolean
  onPress?: () => void
  selectable?: boolean
  style?: StyleProp<ViewStyle>
  subtitle?: string
  subtitleStyle?: StyleProp<TextStyle>
  text?: string
  title?: string
  titleStyle?: StyleProp<TextStyle>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },

  icon: {
    fontSize: columnHeaderItemContentSize,
  },

  title: {
    fontSize: columnHeaderItemContentSize - 2,
    lineHeight: columnHeaderItemContentSize,
  },

  subtitle: {
    fontSize: columnHeaderItemContentSize - 6,
    lineHeight: columnHeaderItemContentSize,
  },

  text: {
    lineHeight: columnHeaderItemContentSize,
  },
})

export function ColumnHeaderItem(props: ColumnHeaderItemProps) {
  const theme = useAnimatedTheme()
  const _username = useReduxState(selectors.currentUsernameSelector)

  const {
    avatarProps: _avatarProps,
    children,
    fixedIconSize,
    iconName,
    iconStyle,
    noPadding,
    onPress,
    selectable,
    style,
    subtitle,
    subtitleStyle,
    text,
    title,
    titleStyle,
  } = props

  const avatarProps = _avatarProps || {}

  const username =
    _username &&
    avatarProps.username &&
    _username.toLowerCase() === avatarProps.username.toLowerCase()
      ? undefined
      : avatarProps.username

  const hasText = !!(title || subtitle || text)

  const wrap: ConditionalWrapProps['wrap'] = child =>
    onPress ? (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.container,
          noPadding
            ? undefined
            : {
                paddingHorizontal: contentPadding / 2,
                paddingVertical: contentPadding,
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
                paddingVertical: contentPadding,
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
                    width: columnHeaderItemContentSize,
                    height: columnHeaderItemContentSize,
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
                      width: columnHeaderItemContentSize,
                      height: columnHeaderItemContentSize,
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

        {children}
      </>
    </ConditionalWrap>
  )
}
