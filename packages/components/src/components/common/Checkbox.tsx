import React, { useState } from 'react'
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
import { useTheme } from '../context/ThemeContext'

const checkboxBorderRadius = 4

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
    borderRadius: checkboxBorderRadius,
    borderWidth: 1,
  },
})

export interface CheckboxProps {
  checked?: boolean | null
  checkedBackgroundColor?: string
  checkedForegroundColor?: string
  containerStyle?: ViewStyle
  defaultValue?: boolean | null
  disabled?: boolean
  enableTrippleState?: boolean
  label?: string | React.ReactNode
  onChange?: (value: boolean | null) => void
  size?: number | string
  uncheckedBackgroundColor?: string
  uncheckedForegroundColor?: string
  useBrandColor?: boolean
}

export function Checkbox(props: CheckboxProps) {
  const theme = useTheme()

  const {
    defaultValue,
    checked = defaultValue,
    checkedBackgroundColor = colors.brandBackgroundColor,
    checkedForegroundColor = colors.brandForegroundColor,
    containerStyle,
    disabled,
    label,
    onChange,
    size = 18,
    enableTrippleState = false,
    uncheckedBackgroundColor,
    uncheckedForegroundColor = theme.foregroundColor,
  } = props

  const [lastBooleanValue, setLastBooleanValue] = useState(
    typeof props.checked === 'boolean' ? props.checked : !!defaultValue,
  )

  const handleOnChange = () => {
    if (!onChange) return

    const newValue = enableTrippleState
      ? checked === null
        ? !lastBooleanValue
        : null
      : !checked

    if (typeof newValue === 'boolean') setLastBooleanValue(newValue)

    onChange(newValue)
  }

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={disabled ? undefined : handleOnChange}
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
            borderColor:
              checked || (enableTrippleState && checked === null)
                ? checkedBackgroundColor
                : uncheckedForegroundColor,
          },
        ]}
      >
        {!!checked && (
          <Icon color={checkedForegroundColor} name="check" size={14} />
        )}

        {enableTrippleState && checked === null && (
          <View
            style={{
              width: '80%',
              height: '80%',
              backgroundColor: checkedBackgroundColor,
              borderRadius: checkboxBorderRadius / 2,
            }}
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
