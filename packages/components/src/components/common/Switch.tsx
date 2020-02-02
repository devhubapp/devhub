import React from 'react'
import {
  Switch as SwitchComponent,
  SwitchProps as SwitchPropsOriginal,
} from 'react-native'

import { Theme, ThemeColors } from '@devhub/core'
import { analytics } from '../../libs/analytics'
import { useTheme } from '../context/ThemeContext'

export interface SwitchProps extends SwitchPropsOriginal {
  analyticsLabel: string | undefined
  analyticsValue?: number | undefined
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
      data-switch
      data-switch-disabled={!!props.disabled}
      onValueChange={onValueChange}
      activeThumbColor={theme.primaryBackgroundColor}
      thumbColor={theme.primaryBackgroundColor}
      trackColor={{
        false: theme.backgroundColorLess2,
        true: theme.backgroundColorLess2,
      }}
      {...otherProps}
    />
  )
}
