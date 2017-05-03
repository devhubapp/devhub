// @flow

import { addNavigationHelpers } from 'react-navigation'

import React from 'react'
import { connect } from 'react-redux'

import Navigator from '../../navigators/AppNavigator'

import { toJS } from '../../utils/immutable'
import type { State } from '../../utils/types'

const mapStateToProps = (state: State) => ({
  navigationState: state.get('navigation'),
})

@connect(mapStateToProps)
export default class extends React.PureComponent {
  static defaultProps = {
    dispatch: undefined,
    innerRef: undefined,
    navigationRef: undefined,
    navigationState: undefined,
  }

  props: {
    dispatch?: Function,
    innerRef?: Function,
    navigationRef?: ?Function,
    navigationState?: ?any,
  }

  render() {
    const {
      dispatch,
      innerRef,
      navigationRef,
      navigationState,
      ...props
    } = this.props
    const state = toJS(navigationState)
    const navigation = addNavigationHelpers({ dispatch, state })

    if (typeof navigationRef === 'function') {
      navigationRef(navigation)
    }

    return <Navigator {...props} ref={innerRef} navigation={navigation} />
  }
}
