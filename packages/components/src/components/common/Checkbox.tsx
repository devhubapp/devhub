import React, { useRef } from 'react'
import {
  PixelRatio,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import {
  contentPadding,
  scaleFactor,
  smallerTextSize,
} from '../../styles/variables'
import { roundToEven } from '../../utils/helpers/shared'
import { ThemedIcon, ThemedIconProps } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'
import { Spacer } from './Spacer'
import { TouchableOpacity, TouchableOpacityProps } from './TouchableOpacity'

export const checkboxBorderRadius = 4 * scaleFactor
export const defaultCheckboxSize = 16 * scaleFactor
export const checkboxLabelSpacing = contentPadding / 2

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

export interface CheckboxProps {
  analyticsLabel?: TouchableOpacityProps['analyticsLabel']
  checked?: boolean | null
  circle?: boolean
  containerStyle?: StyleProp<ViewStyle>
  defaultValue?: boolean | null
  disabled?: boolean
  enableIndeterminateState?: boolean
  label?: string | React.ReactNode
  labelTooltip?: string
  left?: React.ReactNode
  onChange?: (value: boolean | null) => void
  right?: React.ReactNode
  size?: number
  squareContainerStyle?: StyleProp<ViewStyle>
  useBrandColor?: boolean

  checkedBackgroundThemeColor?: ThemedIconProps['color']
  checkedForegroundThemeColor?: ThemedIconProps['color']
  uncheckedBackgroundThemeColor?: ThemedIconProps['color']
  // uncheckedForegroundThemeColor?:
  //   | keyof ThemeColors
  //   | ((theme: Theme) => string)
}

export function Checkbox(props: CheckboxProps) {
  const {
    defaultValue,
    checked = defaultValue,

    analyticsLabel,
    circle,
    containerStyle,
    disabled: _disabled,
    enableIndeterminateState = false,
    label,
    labelTooltip,
    left,
    onChange,
    right,
    size: _size = defaultCheckboxSize,
    squareContainerStyle,

    checkedBackgroundThemeColor = 'primaryBackgroundColor',
    checkedForegroundThemeColor = 'primaryForegroundColor',
    uncheckedBackgroundThemeColor = 'backgroundColorLess4',
    // uncheckedForegroundThemeColor = 'foregroundColor',
  } = props

  const disabled = _disabled || !onChange
  const size = roundToEven(_size)

  const lastBooleanRef = useRef(
    typeof props.checked === 'boolean'
      ? props.checked
      : enableIndeterminateState
      ? !defaultValue
      : !!defaultValue,
  )

  const isIndeterminateState = enableIndeterminateState && checked === null

  const getNextValue = () =>
    enableIndeterminateState
      ? checked === null
        ? !lastBooleanRef.current
        : null
      : !checked

  const handleOnChange = () => {
    if (!onChange) return

    const nextValue = getNextValue()

    if (typeof nextValue === 'boolean') {
      lastBooleanRef.current = nextValue
    }

    setTimeout(() => {
      onChange(nextValue)
    }, 1)
  }

  const borderWidth = PixelRatio.roundToNearestPixel(1 * scaleFactor)

  return (
    <TouchableOpacity
      analyticsAction={
        isIndeterminateState ? 'indeterminate' : checked ? 'uncheck' : 'check'
      }
      analyticsCategory="checkbox"
      analyticsLabel={analyticsLabel}
      disabled={disabled}
      onPress={disabled ? undefined : handleOnChange}
      style={[styles.container, containerStyle, sharedStyles.opacity100]}
    >
      <View
        style={[
          styles.checkboxContainer,
          {
            width: size,
            height: Math.max(
              roundToEven(20 * scaleFactor),
              size + 4 * scaleFactor,
            ),
            borderRadius: circle ? size / 2 : checkboxBorderRadius,
          },
          disabled && sharedStyles.muted,
          squareContainerStyle,
        ]}
      >
        <ThemedView
          borderColor={
            checked || isIndeterminateState
              ? checkedBackgroundThemeColor
              : uncheckedBackgroundThemeColor
          }
          style={[
            styles.checkbox,
            {
              width: size,
              height: size,
              borderWidth,
              borderRadius: circle ? size / 2 : checkboxBorderRadius,
            },
          ]}
        >
          <View
            collapsable={false}
            style={[StyleSheet.absoluteFill, styles.center, { zIndex: 1 }]}
          >
            <ThemedView
              backgroundColor={
                checked || isIndeterminateState
                  ? checkedBackgroundThemeColor
                  : uncheckedBackgroundThemeColor
              }
              style={{
                width: Math.floor(isIndeterminateState ? size * 0.8 : size),
                height: Math.floor(isIndeterminateState ? size * 0.8 : size),
                borderRadius: circle ? size / 2 : checkboxBorderRadius,
              }}
            />
          </View>

          <View
            collapsable={false}
            style={[StyleSheet.absoluteFill, styles.center, { zIndex: 2 }]}
          >
            <ThemedIcon
              color={checkedForegroundThemeColor}
              family="octicon"
              name="check"
              size={size - 5 * scaleFactor}
              style={[
                sharedStyles.textCenter,
                {
                  lineHeight: size - 5 * scaleFactor,
                  opacity: checked ? 1 : 0,
                },
              ]}
            />
          </View>
        </ThemedView>
      </View>

      <Spacer width={checkboxLabelSpacing} />

      {!!left && (
        <View style={[sharedStyles.horizontal, disabled && sharedStyles.muted]}>
          {left}
          <Spacer width={checkboxLabelSpacing} />
        </View>
      )}

      {!!label && (
        <View
          style={[
            sharedStyles.flex,
            sharedStyles.horizontalAndVerticallyAligned,
            sharedStyles.justifyContentSpaceBetween,
            typeof label !== 'string' && disabled && sharedStyles.muted,
          ]}
        >
          {typeof label === 'string' ? (
            <ThemedText
              color={disabled ? 'foregroundColorMuted40' : 'foregroundColor'}
              numberOfLines={1}
              style={[sharedStyles.flex, { lineHeight: size }]}
              {...(!!labelTooltip &&
                Platform.select({
                  web: { title: labelTooltip },
                }))}
            >
              {label}
            </ThemedText>
          ) : (
            label
          )}
        </View>
      )}

      {!!right &&
        (typeof right === 'string' ? (
          <ThemedText
            color="foregroundColorMuted40"
            style={{ fontSize: smallerTextSize }}
          >
            {right}
          </ThemedText>
        ) : (
          <View
            style={[sharedStyles.horizontal, disabled && sharedStyles.muted]}
          >
            <Spacer width={contentPadding / 2} />
            {right}
          </View>
        ))}
    </TouchableOpacity>
  )
}
