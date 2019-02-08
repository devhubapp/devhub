import React from 'react'
import _MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons'
import _Octicons from 'react-native-vector-icons/dist/Octicons'
import MaterialIconFont from 'react-native-vector-icons/Fonts/MaterialIcons.ttf'
import OcticonsFont from 'react-native-vector-icons/Fonts/Octicons.ttf'
import { IconProps } from 'react-native-vector-icons/Icon'
import { createElement } from 'react-native-web'
import { OcticonIconProps } from './index.shared'

export * from './index.shared'

function enhanceIconComponent<P extends IconProps = IconProps>(
  IconComponent: any,
) {
  return React.forwardRef((props: P, ref) =>
    createElement(IconComponent, {
      ...props,
      ref,
      style: [{ userSelect: 'none' }, props.style],
      className: `icon ${(props as any).className || ''}`.trim(),
    }),
  )
}

export const Octicons = enhanceIconComponent<OcticonIconProps>(_Octicons)
export const MaterialIcons = enhanceIconComponent(_MaterialIcons)

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
