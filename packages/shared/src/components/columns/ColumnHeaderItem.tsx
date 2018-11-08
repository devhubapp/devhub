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
import { connect } from 'react-redux'

import { Octicons as Icon } from '../../libs/vector-icons'
import * as selectors from '../../redux/selectors'
import { contentPadding, mutedOpacity } from '../../styles/variables'
import { ExtractPropsFromConnector, GitHubIcon } from '../../types'
import { Avatar, AvatarProps } from '../common/Avatar'
import {
  ConditionalWrap,
  ConditionalWrapProps,
} from '../common/ConditionalWrap'
import { ThemeConsumer } from '../context/ThemeContext'

export const columnHeaderItemContentSize = 20

export interface ColumnHeaderItemProps {
  avatarProps?: Partial<AvatarProps>
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
    paddingHorizontal: contentPadding,
  } as ViewStyle,

  icon: {
    fontSize: columnHeaderItemContentSize,
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

const connectToStore = connect((state: any) => {
  const user = selectors.currentUserSelector(state)

  return {
    username: (user && user.login) || '',
  }
})

class ColumnHeaderItemComponent extends PureComponent<
  ColumnHeaderItemProps & ExtractPropsFromConnector<typeof connectToStore>
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
      avatarProps: _avatarProps,
      iconName,
      iconStyle,
      subtitle,
      subtitleStyle,
      title,
      titleStyle,
      username: _username,
    } = this.props

    const avatarProps = _avatarProps || {}

    const username =
      _username &&
      avatarProps.username &&
      !(_username.toLowerCase() === avatarProps.username.toLowerCase())
        ? avatarProps.username
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
                              columnHeaderItemContentSize + smallAvatarSpacing,
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
                          {...avatarProps}
                          style={[
                            {
                              position: 'absolute',
                              bottom: 0,
                              marginLeft: smallAvatarSpacing,
                              width: 10,
                              height: 10,
                            },
                            avatarProps.style,
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
                    )
                  )}
                </View>
              )}
              {!!(title || subtitle) && (
                <Text
                  numberOfLines={1}
                  style={[
                    styles.title,
                    { color: theme.foregroundColor },
                    titleStyle,
                  ]}
                >
                  {!!title && (
                    <Text>
                      {title.toLowerCase()}
                      {!!subtitle && '  '}
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
                      {subtitle.toLowerCase()}
                    </Text>
                  )}
                </Text>
              )}
            </>
          </ConditionalWrap>
        )}
      </ThemeConsumer>
    )
  }
}

export const ColumnHeaderItem = connectToStore(ColumnHeaderItemComponent)
