import React, { Fragment, PureComponent } from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons'

import { contentPadding, mutedOpacity } from '../../styles/variables'
import { IGitHubIcon } from '../../types'
import { fade } from '../../utils/helpers/color'

export interface IProps {
  backgroundColor: string
  foregroundColor: string
  icon?: IGitHubIcon
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
      icon,
      iconStyle,
      onPress,
      style,
      subtitle,
      subtitleStyle,
      title,
      titleStyle,
      ...props
    } = this.props

    return (
      <TouchableOpacity
        {...props}
        onPress={onPress}
        style={[styles.container, { backgroundColor }, style]}
      >
        <Fragment>
          {!!icon && (
            <Octicons
              color={foregroundColor}
              name={icon}
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
