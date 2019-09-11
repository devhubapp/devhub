import React from 'react'
import _MaterialIconsOriginal from 'react-native-vector-icons/dist/MaterialIcons'
import _OcticonsOriginal from 'react-native-vector-icons/dist/Octicons'
import MaterialIconFont from 'react-native-vector-icons/Fonts/MaterialIcons.ttf'
import OcticonsFont from 'react-native-vector-icons/Fonts/Octicons.ttf'
import { IconProps } from 'react-native-vector-icons/Icon'

const MaterialIconsOriginal = _MaterialIconsOriginal as any
const OcticonsOriginal = _OcticonsOriginal as any

export * from './index.shared'

export const MaterialIcons = (props: IconProps) =>
  React.createElement(MaterialIconsOriginal, {
    ...props,
    style: [props.style, { userSelect: 'none' }],
  })

export const Octicons = (props: IconProps) =>
  React.createElement(OcticonsOriginal, {
    ...props,
    style: [props.style, { userSelect: 'none' }],
  })

const iconStyles = [
  `@font-face { src:url(${MaterialIconFont});font-family: MaterialIcons; }`,
  `@font-face { src:url(${OcticonsFont});font-family: Octicons; }`,
].join('\n')

const style = document.createElement('style')
style.type = 'text/css'

if ((style as any).styleSheet) {
  ;(style as any).styleSheet.cssText = iconStyles
} else {
  style.appendChild(document.createTextNode(iconStyles))
}

if (document.head) document.head.appendChild(style)
