import { ComponentClass } from 'react'
import Octicons from 'react-native-vector-icons/Octicons'

import createIconButton, { IScreenIconProps } from './createIconButton'

const OcticonsIconButton = createIconButton(Octicons) as ComponentClass<
  IScreenIconProps
> & { componentId: string }

OcticonsIconButton.componentId = 'org.brunolemos.devhub.OcticonsIconButton'

export { IScreenIconProps }
export default OcticonsIconButton
