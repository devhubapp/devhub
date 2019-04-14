import React, { useState } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../libs/platform'
import { contentPadding } from '../../styles/variables'
import {
  SpringAnimatedIcon,
  SpringAnimatedIconProps,
} from '../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { TouchableOpacity, TouchableOpacityProps } from './TouchableOpacity'

const checkboxBorderRadius = 4

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    position: 'relative',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export interface SpringAnimatedCheckboxProps {
  analyticsLabel: TouchableOpacityProps['analyticsLabel']
  checked?: boolean | null
  checkedBackgroundColor?: string | any
  checkedForegroundColor?: string | any
  circle?: boolean
  containerStyle?: ViewStyle
  defaultValue?: boolean | null
  disabled?: boolean
  enableIndeterminateState?: boolean
  label?: string | React.ReactNode
  labelIcon?: SpringAnimatedIconProps['name']
  labelTooltip?: string
  onChange?: (value: boolean | null) => void
  size?: number
  squareContainerStyle?: ViewStyle
  uncheckedBackgroundColor?: string | any
  uncheckedForegroundColor?: string | any
  useBrandColor?: boolean
}

export function SpringAnimatedCheckbox(props: SpringAnimatedCheckboxProps) {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const {
    defaultValue,
    checked = defaultValue,

    analyticsLabel,
    squareContainerStyle,
    checkedBackgroundColor = springAnimatedTheme.primaryBackgroundColor,
    checkedForegroundColor = springAnimatedTheme.primaryForegroundColor,
    circle,
    containerStyle,
    disabled,
    enableIndeterminateState = false,
    label,
    labelIcon,
    labelTooltip,
    onChange,
    size = 18,
    uncheckedBackgroundColor,
    uncheckedForegroundColor = springAnimatedTheme.foregroundColor,
  } = props

  const [lastBooleanValue, setLastBooleanValue] = useState(
    typeof props.checked === 'boolean' ? props.checked : !!defaultValue,
  )

  const isIndeterminateState = enableIndeterminateState && checked === null

  const getNextValue = () =>
    enableIndeterminateState
      ? checked === null
        ? !lastBooleanValue
        : null
      : !checked

  const handleOnChange = () => {
    if (!onChange) return

    const nextValue = getNextValue()

    if (typeof nextValue === 'boolean') setLastBooleanValue(nextValue)

    onChange(nextValue)
  }

  const borderWidth = 1

  return (
    <TouchableOpacity
      analyticsAction={
        isIndeterminateState ? 'indeterminate' : checked ? 'uncheck' : 'check'
      }
      analyticsCategory="checkbox"
      analyticsLabel={analyticsLabel}
      disabled={disabled}
      onPress={disabled ? undefined : handleOnChange}
      style={[styles.container, containerStyle]}
    >
      <SpringAnimatedView
        style={[
          styles.checkboxContainer,
          {
            width: size,
            height: size,
            borderRadius: circle ? size / 2 : checkboxBorderRadius,
          },
          squareContainerStyle,
        ]}
      >
        <SpringAnimatedView
          style={[
            styles.checkbox,
            {
              width: size,
              height: size,
              borderWidth,
              borderColor:
                checked || isIndeterminateState
                  ? checkedBackgroundColor
                  : uncheckedForegroundColor,
              borderRadius: circle ? size / 2 : checkboxBorderRadius,
            },
          ]}
        >
          <View
            collapsable={false}
            style={[StyleSheet.absoluteFill, styles.center, { zIndex: 1 }]}
          >
            <SpringAnimatedView
              style={{
                width: Math.floor(
                  (isIndeterminateState ? size * 0.8 : size) - 2 * borderWidth,
                ),
                height: Math.floor(
                  (isIndeterminateState ? size * 0.8 : size) - 2 * borderWidth,
                ),
                backgroundColor:
                  checked || isIndeterminateState
                    ? checkedBackgroundColor
                    : uncheckedBackgroundColor,
                borderRadius: circle ? size / 2 : checkboxBorderRadius / 2,
              }}
            />
          </View>

          <View
            collapsable={false}
            style={[StyleSheet.absoluteFill, styles.center, { zIndex: 2 }]}
          >
            <SpringAnimatedIcon
              name="check"
              size={13}
              style={{
                lineHeight: 13,
                paddingLeft: Platform.OS === 'android' ? 0 : 1,
                paddingTop: Platform.OS === 'ios' ? 1 : 0,
                paddingBottom: Platform.OS === 'android' ? 1 : 0,
                textAlign: 'center',
                opacity: checked ? 1 : 0,
                color: checkedForegroundColor,
              }}
            />
          </View>
        </SpringAnimatedView>
      </SpringAnimatedView>

      {!!label && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'space-between',
          }}
        >
          {typeof label === 'string' ? (
            <SpringAnimatedText
              style={{
                lineHeight: size,
                marginLeft: contentPadding / 2,
                color: springAnimatedTheme.foregroundColor,
              }}
              {...!!labelTooltip &&
                Platform.select({
                  web: { title: labelTooltip },
                })}
            >
              {label}
            </SpringAnimatedText>
          ) : (
            label
          )}

          {!!labelIcon && (
            <SpringAnimatedIcon
              name={labelIcon}
              size={16}
              style={{
                lineHeight: 16,
                color: springAnimatedTheme.foregroundColor,
              }}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  )
}
