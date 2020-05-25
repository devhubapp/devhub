import OcticonsOriginal from 'react-native-vector-icons/dist/Octicons'
import OcticonIconFontURL from 'react-native-vector-icons/Fonts/Octicons.ttf'

import { createWebFont } from '../../helpers/index.web'

const { Component, injectStyleTag } = createWebFont(
  'Octicons',
  OcticonsOriginal,
  OcticonIconFontURL,
)

export { Component as Octicons }

injectStyleTag()
