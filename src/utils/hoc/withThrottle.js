// @flow

import React from 'react'
import throttle from 'lodash/throttle'

const validateInterval = interval => {
  if (!(typeof interval === 'number' && interval >= 0)) {
    throw new Error(
      `[throttle] Interval parameter must be a number (ms) or a function(props) => number. Received ${interval}.`,
    )
  }
}

const validateIntervalOrFn = intervalOrFn =>
  typeof intervalOrFn === 'function' ? true : validateInterval(intervalOrFn)

const getComponentName = Component =>
  Component.displayName || Component.name || 'Component'

export default (intervalOrFn, ...throttleArgs) => {
  validateIntervalOrFn(intervalOrFn)

  return Component =>
    class WithThrottle extends React.PureComponent {
      static displayName = `WithThrottle(${getComponentName(Component)})`

      constructor(props) {
        super(props)

        this.state = { props }
      }

      componentWillReceiveProps = props => {
        const interval =
          typeof intervalOrFn === 'function'
            ? intervalOrFn(props)
            : intervalOrFn
        validateInterval(interval)

        if (interval === 0) {
          this.updateStateWithProps(props)
        } else {
          throttle(this.updateStateWithProps, interval, ...throttleArgs)(props)
        }
      }

      updateStateWithProps = props => {
        this.setState({ props: props || this.props })
      }

      render = () => <Component {...this.state.props} />
    }
}
