import React, { useContext, useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

import { Octicons as Icon } from '../../libs/vector-icons'
import * as colors from '../../styles/colors'
import { contentPadding } from '../../styles/variables'
import { ThemeContext } from '../context/ThemeContext'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 1,
  },
})

export interface CheckboxProps {
  checked?: boolean
  checkedBackgroundColor?: string
  checkedForegroundColor?: string
  containerStyle?: ViewStyle
  disabled?: boolean
  label?: string | React.ReactNode
  onChange?: (value: boolean) => void
  size?: number | string
  uncheckedBackgroundColor?: string
  uncheckedForegroundColor?: string
  useBrandColor?: boolean
}

export function Checkbox(props: CheckboxProps) {
  const { theme } = useContext(ThemeContext)

  const {
    checked,
    checkedBackgroundColor = colors.brandBackgroundColor,
    checkedForegroundColor = colors.brandForegroundColor,
    containerStyle,
    disabled,
    label,
    onChange,
    size = 18,
    uncheckedBackgroundColor,
    uncheckedForegroundColor = theme.foregroundColor,
  } = props

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={disabled ? undefined : () => onChange && onChange(!checked)}
      style={[styles.container, disabled && { opacity: 0.5 }, containerStyle]}
    >
      <View
        style={[
          styles.checkbox,
          {
            width: size,
            height: size,
            backgroundColor: checked
              ? checkedBackgroundColor
              : uncheckedBackgroundColor,
            borderColor: checked
              ? checkedBackgroundColor
              : uncheckedForegroundColor,
          },
        ]}
      >
        {!!checked && (
          <Icon
            color={checked ? checkedForegroundColor : uncheckedForegroundColor}
            name="check"
            size={14}
          />
        )}
      </View>

      {!!label &&
        (typeof label === 'string' ? (
          <Text
            style={{
              marginLeft: contentPadding / 2,
              color: theme.foregroundColor,
            }}
          >
            {label}
          </Text>
        ) : (
          label
        ))}
    </TouchableOpacity>
  )
}
