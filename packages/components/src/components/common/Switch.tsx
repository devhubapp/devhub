import { lighten } from 'polished'
import React from 'react'
import {
  Switch as SwitchComponent,
  SwitchProps as SwitchPropsOriginal,
} from 'react-native'

import { analytics } from '../../libs/analytics'
import { Platform } from '../../libs/platform'
import { useTheme } from '../context/ThemeContext'

export interface SwitchProps extends SwitchPropsOriginal {
  analyticsLabel: string | undefined
  analyticsValue?: number | undefined
  analyticsPayload?: Record<string, string | number | undefined> | undefined
}

export function Switch({
  analyticsLabel,
  analyticsValue,
  onValueChange: _onValueChange,
  ...props
}: SwitchProps) {
  const theme = useTheme()

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
          thumbColor: props.value ? theme.primaryBackgroundColor : 'gray',
          trackColor: {
            false: 'lightgray',
            true: lighten(0.4, theme.primaryBackgroundColor),
          },
        },
        ios: {
          trackColor: { false: '', true: theme.primaryBackgroundColor },
        },
        web: {
          activeThumbColor: '#FFFFFF',
          onTintColor: theme.primaryBackgroundColor,
        },
      })}
      {...props}
    />
  )
}
