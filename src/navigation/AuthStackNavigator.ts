import {
  NavigationRouteConfigMap,
  StackNavigator,
  StackNavigatorConfig,
} from 'react-navigation'

// import Screen from '../components/common/Screen'

export const routes: NavigationRouteConfigMap = {
  // SignIn: Screen,
}

export const options: StackNavigatorConfig = {}

export default StackNavigator(routes, options)
