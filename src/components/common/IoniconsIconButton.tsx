import { ComponentClass } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'

import createIconButton, { IScreenIconProps } from './createIconButton'

const IoniconsIconButton = createIconButton(Ionicons) as ComponentClass<
  IScreenIconProps
> & { componentId: string }

IoniconsIconButton.componentId = 'org.brunolemos.devhub.IoniconsIconButton'

export { IScreenIconProps }

export default IoniconsIconButton
