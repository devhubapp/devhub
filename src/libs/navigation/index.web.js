import React from 'react';

import {
  addNavigationHelpers,
  createNavigator,
  NavigationActions,
  StackRouter,
} from 'react-navigation';

export default from 'react-navigation';

// TODO: Implement proper navigators for the web (StackNavigator and TabNavigator)
// Tried https://github.com/agrcrobles/react-navigation-web/ but it was crashing
// and lack lots of features like custom tabBarComponent, which I need

const NavView = ({ navigation, router }) => {
  const state = router.getStateForAction({ type: NavigationActions.INIT });
  console.log('navigation', navigation, state);
  const Component = router.getComponentForState(state);
  console.log('Component', Component);

  return (
    <Component
      navigation={addNavigationHelpers({
        // ...navigation,
        state: state.routes[state.index],
      })}
    />
  );
};

export const TabNavigator = (RouteConfigs, TabNavigatorConfig = {}) => {
  const routes = StackRouter(RouteConfigs, TabNavigatorConfig);

  return createNavigator(routes)(NavView);
};
