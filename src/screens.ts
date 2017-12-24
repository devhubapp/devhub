import { Navigation } from 'react-native-navigation'

import AvatarNavBarButton from './components/common/AvatarNavBarButton'
import icons, { initIcons } from './icons'
import FeedScreen from './screens/FeedScreen'
import NotificationsScreen from './screens/NotificationsScreen'
import PreferencesScreen from './screens/PreferencesScreen'
import theme from './styles/themes/dark'

export function registerComponents() {
  Navigation.registerComponent(FeedScreen.componentId, () => FeedScreen)
  Navigation.registerComponent(NotificationsScreen.componentId, () => NotificationsScreen)
  Navigation.registerComponent(PreferencesScreen.componentId, () => PreferencesScreen)
  Navigation.registerComponent(AvatarNavBarButton.componentId, () => AvatarNavBarButton)
}

export async function init() {
  registerComponents()
  await initIcons()
}

const appStyle = {
  navBarBackgroundColor: theme.base00,
  navBarButtonColor: theme.base04,
  navBarTextColor: theme.base04,
  navBarTranslucent: false,
  screenBackgroundColor: theme.base00,
  statusBarTextColorScheme: 'dark',
}

const tabsStyle = {
  tabBarBackgroundColor: theme.base00,
  tabBarButtonColor: theme.base04,
  tabBarSelectedButtonColor: theme.brand,
  tabBarTranslucent: false,
}

export function startMainApp() {
  Navigation.startTabBasedApp({
    appStyle, // android bottom tabs
    tabsStyle, // ios bottom tab bar
    tabs: [
      {
        icon: icons.feed,
        label: 'Feed',
        screen: FeedScreen.componentId,
        title: 'Feed',
      },
      {
        icon: icons.notifications,
        label: 'Notifications',
        screen: NotificationsScreen.componentId,
        title: 'Notifications',
      },
      {
        icon: icons.settings,
        label: 'Preferences',
        screen: PreferencesScreen.componentId,
        title: 'Preferences',
      },
    ],
  })
}
