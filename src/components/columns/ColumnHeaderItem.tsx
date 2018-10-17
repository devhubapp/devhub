import { rgba } from 'polished'
import React, { PureComponent } from 'react'
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

import { Octicons as Icon } from '../../libs/vector-icons'
import { contentPadding, mutedOpacity } from '../../styles/variables'
import { GitHubIcon } from '../../types'
import { Avatar, AvatarProps } from '../common/Avatar'
import {
  ConditionalWrap,
  ConditionalWrapProps,
} from '../common/ConditionalWrap'
import { ThemeConsumer } from '../context/ThemeContext'
import { UserConsumer } from '../context/UserContext'

export const columnHeaderItemContentSize = 20

export interface ColumnHeaderItemProps {
  avatarDetails?: {
    owner: string
    repo?: string
  }
  avatarShape?: AvatarProps['shape']
  avatarStyle?: StyleProp<ImageStyle>
  iconName?: GitHubIcon
  iconStyle?: StyleProp<TextStyle>
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  subtitle?: string
  subtitleStyle?: StyleProp<TextStyle>
  title?: string
  titleStyle?: StyleProp<TextStyle>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: contentPadding,
  } as ViewStyle,

  icon: {
    fontSize: columnHeaderItemContentSize,
    lineHeight: columnHeaderItemContentSize,
  } as TextStyle,

  title: {
    fontSize: columnHeaderItemContentSize - 2,
    lineHeight: columnHeaderItemContentSize,
  } as TextStyle,

  subtitle: {
    fontSize: columnHeaderItemContentSize - 6,
    lineHeight: columnHeaderItemContentSize,
  } as TextStyle,
})

export class ColumnHeaderItem extends PureComponent<ColumnHeaderItemProps> {
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
      avatarDetails,
      avatarShape,
      avatarStyle,
      iconName,
      iconStyle,
      subtitle,
      subtitleStyle,
      title,
      titleStyle,
    } = this.props

    return (
      <UserConsumer>
        {({ user }) => {
          const username =
            avatarDetails &&
            avatarDetails.owner &&
            !(user && user.login === avatarDetails.owner)
              ? avatarDetails.owner
              : undefined

          const smallAvatarSpacing = 5

          return (
            <ThemeConsumer>
              {({ theme }) => (
                <ConditionalWrap condition wrap={this.wrap}>
                  <>
                    {(!!iconName || !!username) && (
                      <View
                        style={{
                          position: 'relative',
                          alignContent: 'center',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight:
                            title || subtitle
                              ? 8 + (username ? smallAvatarSpacing : 0)
                              : 0,
                        }}
                      >
                        {iconName ? (
                          <>
                            <Icon
                              color={theme.foregroundColor}
                              name={iconName}
                              style={[styles.icon, iconStyle]}
                            />

                            {!!username && (
                              <Avatar
                                hitSlop={{
                                  top:
                                    columnHeaderItemContentSize +
                                    smallAvatarSpacing,
                                  bottom: smallAvatarSpacing,
                                  left:
                                    columnHeaderItemContentSize / 2 +
                                    smallAvatarSpacing,
                                  right:
                                    columnHeaderItemContentSize / 2 +
                                    smallAvatarSpacing,
                                }}
                                isBot={false}
                                linkURL=""
                                repo={avatarDetails && avatarDetails.repo}
                                shape={avatarShape}
                                style={[
                                  {
                                    position: 'absolute',
                                    bottom: 0,
                                    marginLeft: smallAvatarSpacing,
                                    width: 10,
                                    height: 10,
                                  },
                                  avatarStyle,
                                ]}
                                username={username}
                              />
                            )}
                          </>
                        ) : (
                          !!username && (
                            <Avatar
                              isBot={false}
                              linkURL=""
                              repo={avatarDetails && avatarDetails.repo}
                              shape={avatarShape}
                              style={[
                                {
                                  width: columnHeaderItemContentSize,
                                  height: columnHeaderItemContentSize,
                                },
                                avatarStyle,
                              ]}
                              username={username}
                            />
                          )
                        )}
                      </View>
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
                  </>
                </ConditionalWrap>
              )}
            </ThemeConsumer>
          )
        }}
      </UserConsumer>
    )
  }
}
