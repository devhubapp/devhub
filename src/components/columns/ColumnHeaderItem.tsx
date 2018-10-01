import React, { Fragment, PureComponent } from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'

import { Octicons as Icon } from '../../libs/vector-icons'
import { contentPadding, mutedOpacity } from '../../styles/variables'
import { IGitHubIcon } from '../../types'
import { fade } from '../../utils/helpers/color'
import Avatar from '../common/Avatar'

export interface IProps {
  backgroundColor: string
  foregroundColor: string
  iconName?: IGitHubIcon
  iconStyle?: StyleProp<TextStyle>
  onPress?: () => void
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
    fontSize: 20,
  } as TextStyle,

  title: {
    fontSize: 18,
  } as TextStyle,

  subtitle: {
    fontSize: 14,
  } as TextStyle,
})

export default class ColumnHeaderItem extends PureComponent<IProps> {
  render() {
    const {
      backgroundColor,
      foregroundColor,
      iconName,
      iconStyle,
      onPress,
      showAvatarAsIcon,
      style,
      subtitle,
      subtitleStyle,
      title,
      titleStyle,
      username,
      ...props
    } = this.props

    return (
      <TouchableOpacity
        {...props}
        onPress={onPress}
        style={[styles.container, { backgroundColor }, style]}
      >
        <Fragment>
          {showAvatarAsIcon
            ? !!username && (
                <Avatar
                  isBot={false}
                  linkURL=""
                  username={username}
                  style={[
                    {
                      width: 20,
                      height: 20,
                    },
                    !!title || !!subtitle
                      ? {
                          marginRight: 8,
                        }
                      : undefined,
                  ]}
                />
              )
            : !!iconName && (
                <Icon
                  color={foregroundColor}
                  name={iconName}
                  style={[
                    styles.icon,
                    (!!title || !!subtitle) && {
                      marginRight: 4,
                    },
                    iconStyle,
                  ]}
                />
              )}

          {!!title && (
            <Text
              style={[styles.title, { color: foregroundColor }, titleStyle]}
            >
              {title.toLowerCase()}
            </Text>
          )}
          {!!subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: fade(foregroundColor, mutedOpacity) },
                subtitleStyle,
              ]}
            >
              {!!title && '  '}
              {subtitle.toLowerCase()}
            </Text>
          )}
        </Fragment>
      </TouchableOpacity>
    )
  }
}
