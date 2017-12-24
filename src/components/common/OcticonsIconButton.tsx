import Octicons from 'react-native-vector-icons/Octicons'

import createIconButton from './createIconButton'

export { IScreenIconProps } from './createIconButton'

const OcticonsIconButton = createIconButton(Octicons)

OcticonsIconButton.componentId = 'org.brunolemos.devhub.OcticonsIconButton'

export default OcticonsIconButton
