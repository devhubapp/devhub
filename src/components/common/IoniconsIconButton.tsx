import Ionicons from 'react-native-vector-icons/Ionicons'

import createIconButton from './createIconButton'

export { IScreenIconProps } from './createIconButton'

const IoniconsIconButton = createIconButton(Ionicons)

IoniconsIconButton.componentId = 'org.brunolemos.devhub.IoniconsIconButton'

export default IoniconsIconButton
