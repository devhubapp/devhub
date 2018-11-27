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

import { ExtractPropsFromConnector, GitHubIcon } from 'shared-core/dist/types'
import { Octicons as Icon } from '../../libs/vector-icons'
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
import { ThemeConsumer } from '../context/ThemeContext'

export interface ColumnHeaderItemProps {
  avatarProps?: Partial<AvatarProps>
  avatarStyle?: StyleProp<ImageStyle>
  children?: React.ReactNode
  fixedIconSize?: boolean
  iconName?: GitHubIcon
  iconStyle?: StyleProp<TextStyle>
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
    padding: contentPadding,
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

const connectToStore = connect((state: any) => ({
  username: selectors.currentUsernameSelector(state),
}))

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
      children,
      fixedIconSize,
      iconName,
      iconStyle,
      selectable,
      subtitle,
      subtitleStyle,
      text,
      title,
      titleStyle,
      username: _username,
    } = this.props

    const avatarProps = _avatarProps || {}

    const username =
      _username &&
      avatarProps.username &&
      _username.toLowerCase() === avatarProps.username.toLowerCase()
        ? undefined
        : avatarProps.username

    const hasText = !!(title || subtitle || text)

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
        )}
      </ThemeConsumer>
    )
  }
}

export const ColumnHeaderItem = connectToStore(ColumnHeaderItemComponent)
