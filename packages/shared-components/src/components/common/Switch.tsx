import React from 'react'
import { Switch as SwitchComponent, SwitchProps } from 'react-native'

import { Platform } from '../../libs/platform'
import * as colors from '../../styles/colors'

export function Switch(props: SwitchProps) {
  return (
    <SwitchComponent
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
