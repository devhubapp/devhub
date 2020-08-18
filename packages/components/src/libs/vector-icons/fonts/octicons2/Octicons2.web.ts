import React from 'react'
import { IconProps } from 'react-native-vector-icons/Icon'

import { Octicons as OcticonsLegacy } from '../octicons/Octicons'
import IconSet from './generated/Octicons2'

// @ts-ignore
import IconFontURL from './generated/Octicons2.ttf'

import { createWebFont } from '../../helpers/index.web'

const { Component: OriginalComponent, injectStyleTag } = createWebFont(
  'Octicons2',
  IconSet,
  IconFontURL,
)

const Component = (props: IconProps) => {
  const initialName = props.name || 'mark-github'

  const heights = props.size && props.size < 16 ? [16, 24] : [24, 16]
  const existingHeight = heights.find((h) =>
    IconSet.hasIcon(`${initialName}-${h}` as any) ? h : undefined,
  )

  if (props.name && !existingHeight) {
    return React.createElement(OcticonsLegacy, props)
  }

  const fixedName = `${initialName}-${existingHeight}`

  return React.createElement(OriginalComponent, { ...props, name: fixedName })
}

export { Component as Octicons }

injectStyleTag()
