import MaterialIconFont from 'react-native-vector-icons/Fonts/MaterialIcons.ttf'
import OcticonsFont from 'react-native-vector-icons/Fonts/Octicons.ttf'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Octicons from 'react-native-vector-icons/Octicons'

export * from 'react-native-vector-icons'
export { MaterialIcons, Octicons }

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

document.head.appendChild(style)
