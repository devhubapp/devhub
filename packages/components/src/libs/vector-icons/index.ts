import { ThemeColors } from '@devhub/core'

import { MaterialIconProps } from './fonts/material/Material'
import { OcticonIconProps } from './fonts/octicons/Octicons'

export * from './fonts/material/Material'
export * from './fonts/octicons/Octicons'

export type IconProp = {
  color?: keyof ThemeColors
} & (
  | ({
      family: 'octicon'
      name: OcticonIconProps['name']
    })
  | ({
      family: 'material'
      name: MaterialIconProps['name']
    }))
