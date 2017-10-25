import React from 'react'
import { connect } from 'react-redux'

import { getNavigatorSelectedRoute } from '../../selectors'
import { get } from '../../utils/immutable'

const makeMapStateToProps = navigatorStateSelector => (state, ownProps) => {
  const { navigation: { state: { key } } } = ownProps
  const navigationState = navigatorStateSelector(state, ownProps)

  return {
    isCurrentRoute:
      !!key &&
      !!navigationState &&
      key === get(getNavigatorSelectedRoute(state, { navigationState }), 'key'),
  }
}

export default navigatorStateSelector => Component => {
  @connect(makeMapStateToProps(navigatorStateSelector))
  class ComponentWithCurrentRoute extends React.PureComponent {
    render = () => <Component {...this.props} />
  }

  return ComponentWithCurrentRoute
}
