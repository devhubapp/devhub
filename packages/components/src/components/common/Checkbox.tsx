import React, { useState } from 'react'
import { Animated, StyleSheet, View, ViewStyle } from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import * as colors from '../../styles/colors'
import { contentPadding } from '../../styles/variables'
import { AnimatedIcon, AnimatedIconProps } from '../animated/AnimatedIcon'
import { TouchableOpacity, TouchableOpacityProps } from './TouchableOpacity'

const checkboxBorderRadius = 4

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    position: 'relative',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  center: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export interface CheckboxProps {
  analyticsLabel: TouchableOpacityProps['analyticsLabel']
  checked?: boolean | null
  checkedBackgroundColor?: string | Animated.AnimatedInterpolation
  checkedForegroundColor?: string | Animated.AnimatedInterpolation
  circle?: boolean
  containerStyle?: ViewStyle
  defaultValue?: boolean | null
  disabled?: boolean
  enableTripleState?: boolean
  label?: string | React.ReactNode
  labelIcon?: AnimatedIconProps['name']
  onChange?: (value: boolean | null) => void
  size?: number
  uncheckedBackgroundColor?: string | Animated.AnimatedInterpolation
  uncheckedForegroundColor?: string | Animated.AnimatedInterpolation
  useBrandColor?: boolean
}

export function Checkbox(props: CheckboxProps) {
  const theme = useAnimatedTheme()

  const {
    analyticsLabel,
    defaultValue,
    checked = defaultValue,
    checkedBackgroundColor = colors.brandBackgroundColor,
    checkedForegroundColor = colors.brandForegroundColor,
    circle,
    containerStyle,
    disabled,
    label,
    labelIcon,
    onChange,
    size = 18,
    enableTripleState = false,
    uncheckedBackgroundColor,
    uncheckedForegroundColor = theme.foregroundColor,
  } = props

  const [lastBooleanValue, setLastBooleanValue] = useState(
    typeof props.checked === 'boolean' ? props.checked : !!defaultValue,
  )

  const isThirdState = enableTripleState && checked === null

  const getNextValue = () =>
    enableTripleState ? (checked === null ? !lastBooleanValue : null) : !checked

  const handleOnChange = () => {
    if (!onChange) return

    const nextValue = getNextValue()

    if (typeof nextValue === 'boolean') setLastBooleanValue(nextValue)

    onChange(nextValue)
  }

  return (
    <TouchableOpacity
      analyticsAction={isThirdState ? 'triple' : checked ? 'uncheck' : 'check'}
      analyticsCategory="checkbox"
      analyticsLabel={analyticsLabel}
      disabled={disabled}
      onPress={disabled ? undefined : handleOnChange}
      style={[styles.container, containerStyle]}
    >
      <Animated.View
        style={[
          styles.checkbox,
          {
            width: size,
            height: size,
            // backgroundColor: checked
            //   ? checkedBackgroundColor
            //   : uncheckedBackgroundColor,
            borderColor:
              checked || isThirdState
                ? checkedBackgroundColor
                : uncheckedForegroundColor,
            borderRadius: circle ? size / 2 : checkboxBorderRadius,
          },
        ]}
      >
        <View style={[StyleSheet.absoluteFill, styles.center, { zIndex: 1 }]}>
          <Animated.View
            style={{
              width: isThirdState ? '80%' : '100%',
              height: isThirdState ? '80%' : '100%',
              backgroundColor:
                checked || isThirdState
                  ? checkedBackgroundColor
                  : uncheckedBackgroundColor,
              borderRadius: circle ? size / 2 : checkboxBorderRadius / 2,
            }}
          />
        </View>

        <View style={[StyleSheet.absoluteFill, styles.center, { zIndex: 2 }]}>
          <AnimatedIcon
            color={checkedForegroundColor}
            name="check"
            size={13}
            style={{
              textAlign: 'center',
              opacity: checked ? 1 : 0,
            }}
          />
        </View>
      </Animated.View>

      {!!label && (
        <View
          style={{
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Animated.Text
            style={{
              marginLeft: contentPadding / 2,
              color: theme.foregroundColor,
            }}
          >
            {typeof label === 'string' ? (
              <Animated.Text
                style={{
                  marginLeft: contentPadding / 2,
                  color: theme.foregroundColor,
                }}
              >
                {label}
              </Animated.Text>
            ) : (
              label
            )}
          </Animated.Text>

          {!!labelIcon && (
            <AnimatedIcon
              color={theme.foregroundColor}
              name={labelIcon}
              size={16}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  )
}
