import React from 'react'
import {
  Switch as SwitchComponent,
  SwitchProps as SwitchPropsOriginal,
} from 'react-native'

import { Theme, ThemeColors } from '@devhub/core'
import { analytics } from '../../libs/analytics'
import { Platform } from '../../libs/platform'
import { mutedOpacity } from '../../styles/variables'
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
    style,
    ...otherProps
  } = props

  const theme = useTheme()

  const onValueChange: typeof _onValueChange =
    analyticsLabel && _onValueChange
      ? (e) => {
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
      activeThumbColor={theme.white}
      data-switch
      data-switch-disabled={!!props.disabled}
      onValueChange={onValueChange}
      style={[
        style,
        Platform.OS === 'android' && {
          opacity: otherProps.disabled ? mutedOpacity : 1,
        },
      ]}
      thumbColor={theme.white}
      trackColor={{
        false: theme.backgroundColorLess5,
        true: theme.primaryBackgroundColor,
      }}
      {...otherProps}
    />
  )
}
