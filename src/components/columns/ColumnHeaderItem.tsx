import { rgba } from 'polished'
import React, { Fragment, PureComponent } from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

import { Octicons as Icon } from '../../libs/vector-icons'
import { contentPadding, mutedOpacity } from '../../styles/variables'
import { IGitHubIcon } from '../../types'
import Avatar, { AvatarProps } from '../common/Avatar'
import {
  ConditionalWrap,
  ConditionalWrapProps,
} from '../common/ConditionalWrap'
import { ThemeConsumer } from '../context/ThemeContext'

export const columnHeaderItemContentSize = 20

export interface ColumnHeaderItemProps {
  avatarShape?: AvatarProps['shape']
  iconName?: IGitHubIcon
  iconStyle?: StyleProp<TextStyle>
  onPress?: () => void
  repo?: string
  showAvatarAsIcon?: boolean
  style?: StyleProp<ViewStyle>
  subtitle?: string
  subtitleStyle?: StyleProp<TextStyle>
  title?: string
  titleStyle?: StyleProp<TextStyle>
  username?: string
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: contentPadding,
  } as ViewStyle,

  icon: {
    fontSize: columnHeaderItemContentSize,
  } as TextStyle,

  title: {
    fontSize: columnHeaderItemContentSize - 2,
  } as TextStyle,

  subtitle: {
    fontSize: columnHeaderItemContentSize - 6,
  } as TextStyle,
})

export default class ColumnHeaderItem extends PureComponent<
  ColumnHeaderItemProps
> {
  wrap: ConditionalWrapProps['wrap'] = children =>
    this.props.onPress ? (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={[styles.container, this.props.style]}
      >
        {children}
      </TouchableOpacity>
    ) : (
      <View style={[styles.container, this.props.style]}>{children}</View>
    )

  render() {
    const {
      avatarShape,
      iconName,
      iconStyle,
      repo,
      showAvatarAsIcon,
      subtitle,
      subtitleStyle,
      title,
      titleStyle,
      username,
    } = this.props

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <ConditionalWrap condition wrap={this.wrap}>
            <Fragment>
              {showAvatarAsIcon
                ? !!username && (
                    <Avatar
                      isBot={false}
                      linkURL=""
                      repo={repo}
                      shape={avatarShape}
                      style={[
                        {
                          width: columnHeaderItemContentSize,
                          height: columnHeaderItemContentSize,
                        },
                        !!title || !!subtitle
                          ? {
                              marginRight: 8,
                            }
                          : undefined,
                      ]}
                      username={username}
                    />
                  )
                : !!iconName && (
                    <Icon
                      color={theme.foregroundColor}
                      name={iconName}
                      style={[
                        styles.icon,
                        (!!title || !!subtitle) && {
                          marginRight: 8,
                        },
                        iconStyle,
                      ]}
                    />
                  )}

              {!!title && (
                <Text
                  style={[
                    styles.title,
                    { color: theme.foregroundColor },
                    titleStyle,
                  ]}
                >
                  {title.toLowerCase()}
                </Text>
              )}
              {!!subtitle && (
                <Text
                  style={[
                    styles.subtitle,
                    { color: rgba(theme.foregroundColor, mutedOpacity) },
                    subtitleStyle,
                  ]}
                >
                  {!!title && '  '}
                  {subtitle.toLowerCase()}
                </Text>
              )}
            </Fragment>
          </ConditionalWrap>
        )}
      </ThemeConsumer>
    )
  }
}
