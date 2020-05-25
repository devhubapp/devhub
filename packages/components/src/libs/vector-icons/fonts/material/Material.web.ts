import MaterialIconsOriginal from 'react-native-vector-icons/dist/MaterialIcons'
import MaterialIconFontURL from 'react-native-vector-icons/Fonts/MaterialIcons.ttf'

import { createWebFont } from '../../helpers/index.web'

const { Component, injectStyleTag } = createWebFont(
  'MaterialIcons',
  MaterialIconsOriginal,
  MaterialIconFontURL,
)

export { Component as MaterialIcons }

injectStyleTag()
