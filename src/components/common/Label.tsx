// @flow

import React, { ReactNode, SFC } from 'react'
import {
  StyleSheet,
  Text,
  TextProperties,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/Octicons'

import {
  contentPadding,
  mutedOpacity,
  radius as defaultRadius,
} from '../../styles/variables'

import theme from '../../styles/themes/dark'

export interface IProps extends TextProperties {
  borderColor?: string
  children: ReactNode
  color?: string
  containerProps?: object
  containerStyle?: ViewStyle
  isPrivate?: boolean
  muted?: boolean
  outline?: boolean
  radius?: number
  textColor?: string
}

const styles = StyleSheet.create({
  labelContainer: {
    borderRadius: defaultRadius,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: contentPadding,
    paddingVertical: 2,
  } as ViewStyle,
  labelText: {
    fontSize: 14,
  } as TextStyle,
})

const Label: SFC<IProps> = ({
  borderColor,
  color,
  children,
  containerStyle,
  containerProps = {},
  muted,
  outline,
  isPrivate,
  radius = defaultRadius,
  textColor,
  ...props
}) => (
  <View
    style={[
      styles.labelContainer,
      containerStyle,
      { borderColor: borderColor || color || theme.base04 },
      !outline && {
        backgroundColor: color || theme.base04,
      },
      Boolean(radius) && { borderRadius: radius },
    ]}
    {...containerProps}
  >
    <Text
      style={[
        styles.labelText,
        {
          color:
            textColor ||
            (outline
              ? color || (muted ? theme.base05 : theme.base04)
              : '#FFFFFF'),
        },
        muted && { opacity: mutedOpacity },
      ]}
      {...props}
    >
      {Boolean(isPrivate) && (
        <Text>
          <Icon name="lock" />&nbsp,
        </Text>
      )}
      {children}
    </Text>
  </View>
)

export default Label
