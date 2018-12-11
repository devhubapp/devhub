import React from 'react'
import {
  Switch as SwitchComponent,
  SwitchProps as SwitchPropsOriginal,
} from 'react-native'

import { analytics } from '../../libs/analytics'
import { Platform } from '../../libs/platform'
import * as colors from '../../styles/colors'

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
        default: {
          trackColor: { false: '', true: colors.brandBackgroundColor },
        },
        web: {
          activeThumbColor: '#FFFFFF',
          onTintColor: colors.brandBackgroundColor,
        },
      })}
      {...props}
    />
  )
}
