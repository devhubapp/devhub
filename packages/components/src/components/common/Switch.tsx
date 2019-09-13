import { lighten } from 'polished'
import React from 'react'
import {
  Switch as SwitchComponent,
  SwitchProps as SwitchPropsOriginal,
} from 'react-native'

import { Theme, ThemeColors } from '@devhub/core'
import { analytics } from '../../libs/analytics'
import { Platform } from '../../libs/platform'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from '../themed/helpers'

export interface SwitchProps extends SwitchPropsOriginal {
  analyticsLabel: string | undefined
  analyticsValue?: number | undefined
  analyticsPayload?: Record<string, string | number | undefined> | undefined
  color?: keyof ThemeColors | ((theme: Theme) => string)
}

export function Switch(props: SwitchProps) {
  const {
    analyticsLabel,
    analyticsValue,
    color: _color,
    onValueChange: _onValueChange,
    ...otherProps
  } = props

  const theme = useTheme()

  const color = getThemeColorOrItself(
    theme,
    _color || 'primaryBackgroundColor',
    { enableCSSVariable: false },
  )!

  const onValueChange: typeof _onValueChange =
    analyticsLabel && _onValueChange
      ? e => {
          analytics.trackEvent(
            'switch',
            'toggle',
            analyticsLabel,
            analyticsValue,
          )
          _onValueChange(e)
        }
      : _onValueChange

  return (
    <SwitchComponent
      onValueChange={onValueChange}
      {...Platform.select({
        android: {
          thumbColor: otherProps.value ? color : 'gray',
          trackColor: {
            false: 'lightgray',
            true: lighten(0.4, color),
          },
        },
        ios: {
          trackColor: { false: '', true: color },
        },
        web: {
          activeThumbColor: '#FFFFFF',
          onTintColor: color,
        },
      })}
      {...otherProps}
    />
  )
}
