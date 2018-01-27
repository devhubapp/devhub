import { PureComponent } from 'react'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import { Navigation } from 'react-native-navigation'

import AvatarNavBarButton from './components/common/AvatarNavBarButton'
import icons, { initIcons } from './icons'
import FeedScreen from './screens/FeedScreen'
import NotificationsScreen from './screens/NotificationsScreen'
import PreferencesScreen from './screens/PreferencesScreen'
import theme from './styles/themes/dark'

export interface IScreenComponent extends PureComponent {
  componentId: string
}

function register(screenComponents: { [key: string]: IScreenComponent }) {
  Object.values(screenComponents).forEach(ScreenComponent => {
    Navigation.registerComponent(ScreenComponent.componentId, () =>
      gestureHandlerRootHOC(ScreenComponent),
    )
  })
}

export const screens: { [key: string]: IScreenComponent } = {
  FeedScreen,
  NotificationsScreen,
  PreferencesScreen,
}

const components: { [key: string]: IScreenComponent } = {
  AvatarNavBarButton,
}

export async function init() {
  await initIcons()
  register(screens)
  register(components)
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
