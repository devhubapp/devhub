import { Navigation } from 'react-native-navigation'
import { ImageSource } from 'react-native-vector-icons/Icon'
import Octicons from 'react-native-vector-icons/Octicons'
import IoniconsIconButton from './components/common/IoniconsIconButton'
import OcticonsIconButton from './components/common/OcticonsIconButton'

export enum IconField {
  feed = 'feed',
  notifications = 'notifications',
  settings = 'settings',
}

const iconDetails: {
  [key in IconField]: { Font: typeof Octicons; color?: string; icon: string; size?: number }
} = {
  feed: { Font: Octicons, icon: 'home', size: 24 },
  notifications: { Font: Octicons, icon: 'globe', size: 24 },
  settings: { Font: Octicons, icon: 'gear', size: 24 },
}

const icons: { [key in IconField]?: ImageSource } = {}

function registerIconComponents() {
  Navigation.registerComponent(IoniconsIconButton.componentId, () => IoniconsIconButton)
  Navigation.registerComponent(OcticonsIconButton.componentId, () => OcticonsIconButton)
}

export async function initIcons() {
  registerIconComponents()

  const fields = Object.keys(iconDetails) as IconField[]
  const imageSources = await Promise.all(
    Object.values(iconDetails).map(({ Font, color = 'black', icon, size = 24 }) =>
      Font.getImageSource(icon, size, color),
    ),
  )

  fields.forEach((field, index) => {
    icons[field] = imageSources[index]
  })

  return icons
}

export default icons
