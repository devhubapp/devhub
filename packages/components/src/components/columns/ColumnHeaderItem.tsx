import React from 'react'
import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

import { GitHubIcon } from '@devhub/core/src/types'
import { Octicons as Icon } from '../../libs/vector-icons'
import { useReduxState } from '../../redux/hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import {
  columnHeaderItemContentSize,
  contentPadding,
} from '../../styles/variables'
import { Avatar, AvatarProps } from '../common/Avatar'
import {
  ConditionalWrap,
  ConditionalWrapProps,
} from '../common/ConditionalWrap'
import { useTheme } from '../context/ThemeContext'

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
  const theme = useTheme()
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
                <Icon
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
          <Text
            numberOfLines={1}
            selectable={selectable}
            style={[{ color: theme.foregroundColorMuted50 }]}
          >
            {!!title && (
              <Text
                selectable={selectable}
                style={[
                  styles.title,
                  { color: theme.foregroundColor },
                  titleStyle,
                ]}
              >
                {title.toLowerCase()}
                {!!subtitle && '  '}
              </Text>
            )}

            {!!subtitle && (
              <Text
                selectable={selectable}
                style={[
                  styles.subtitle,
                  { color: theme.foregroundColorMuted50 },
                  subtitleStyle,
                ]}
              >
                {subtitle.toLowerCase()}
              </Text>
            )}

            {!!text && (
              <Text
                selectable={selectable}
                style={[styles.text, { color: theme.foregroundColor }]}
              >
                {text}
              </Text>
            )}
          </Text>
        )}

        {children}
      </>
    </ConditionalWrap>
  )
}
