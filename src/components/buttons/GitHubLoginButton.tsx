import React, { SFC } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextProperties,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProperties,
  View,
  ViewStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/Octicons'

import theme from '../../styles/themes/dark'
import { contentPadding, radius as defaultRadius } from '../../styles/variables'

export interface IProps extends TouchableOpacityProperties {
  horizontal?: boolean
  leftIcon?: string
  loading?: boolean
  radius?: number
  rightIcon?: string
  subtitle?: string
  subtitleProps?: TextProperties
  textProps?: TextProperties
  title?: string
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.invert().base02,
    borderColor: theme.base02,
    borderRadius: defaultRadius,
    borderWidth: StyleSheet.hairlineWidth,
    height: 58,
  } as ViewStyle,

  content: {
    flex: 1,
    flexDirection: 'row',
  } as ViewStyle,

  iconWrapper: {
    alignItems: 'center',
    borderColor: theme.base04,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderWidth: 0,
    justifyContent: 'center',
    paddingHorizontal: contentPadding,
  } as ViewStyle,

  icon: {
    color: theme.invert().base04,
    fontSize: 20,
  } as TextStyle,

  mainContentContainer: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: contentPadding,
  } as ViewStyle,

  title: {
    color: theme.invert().base04,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'left',
  } as TextStyle,

  subtitleText: {
    color: theme.invert().base05,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
  } as TextStyle,
})

const GithubButton: SFC<IProps> = ({
  leftIcon,
  loading,
  rightIcon,
  subtitle,
  subtitleProps = {},
  textProps = {},
  title,
  ...props
}) => (
  <TouchableOpacity
    activeOpacity={0.9}
    {...props}
    style={[styles.button, props.style]}
  >
    <View style={styles.content}>
      {Boolean(leftIcon) && (
        <View style={styles.iconWrapper}>
          <Icon name={leftIcon!} style={styles.icon} />
        </View>
      )}

      <View style={styles.mainContentContainer}>
        {Boolean(title) && (
          <Text {...textProps} style={[styles.title, textProps.style]}>
            {title}
          </Text>
        )}

        {Boolean(subtitle) && (
          <Text
            {...subtitleProps}
            style={[styles.subtitleText, subtitleProps.style]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {Boolean(rightIcon || loading) && (
        <View style={styles.iconWrapper}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Icon name={rightIcon!} style={styles.icon} />
          )}
        </View>
      )}
    </View>
  </TouchableOpacity>
)

GithubButton.defaultProps = {
  leftIcon: 'mark-github',
  loading: false,
  radius: defaultRadius,
  rightIcon: '',
  subtitle: '',
  subtitleProps: undefined,
  textProps: undefined,
  title: '',
}

export default GithubButton
