import React from 'react'
import { IconProps } from 'react-native-vector-icons/Icon'

import * as OcticonsLegacy from '../octicons/Octicons'
import IconSet from './generated/Octicons2'

export const Octicons = (React.forwardRef<
  OcticonsLegacy.Octicons,
  OcticonIconProps
>((props, ref) => {
  const initialName = props.name || 'mark-github'

  const heights = props.size && props.size < 16 ? [16, 24] : [24, 16]
  const existingHeight = heights.find(h =>
    IconSet.hasIcon(`${initialName}-${h}` as any) ? h : undefined,
  )

  if (props.name && !existingHeight) {
    return React.createElement(OcticonsLegacy.Octicons, props as IconProps)
  }

  const fixedName = `${initialName}-${existingHeight}`

  return React.createElement(IconSet as any, { ...props, ref, name: fixedName })
}) as any) as typeof OcticonsLegacy.Octicons

export type Octicons = OcticonsLegacy.Octicons

export interface OcticonIconProps
  extends Omit<OcticonsLegacy.OcticonIconProps, 'name'> {
  name: OcticonIconName
}

export type OcticonIconName =
  | OcticonsLegacy.OcticonIconName
  | 'bookmark-fill'
  | 'bookmark-slash'
  | 'bookmark-slash-fill'
  | 'dot'
  | 'dot-fill'
