// @flow

import React from 'react'
import debounce from 'lodash/debounce'

const validateInterval = interval => {
  if (!(typeof interval === 'number' && interval >= 0)) {
    throw new Error(
      `[debounce] Interval parameter must be a number (ms) or a function(props) => number. Received ${interval}.`,
    )
  }
}

const validateIntervalOrFn = intervalOrFn =>
  typeof intervalOrFn === 'function' ? true : validateInterval(intervalOrFn)

export default (intervalOrFn, ...debounceArgs) => {
  validateIntervalOrFn(intervalOrFn)

  return Component =>
    class extends React.PureComponent {
      constructor(props) {
        super(props)

        this.state = { props }
      }

      updateStateWithProps = props => {
        this.setState({ props: props || this.props })
      }

      componentWillReceiveProps = props => {
        const interval = typeof intervalOrFn === 'function'
          ? intervalOrFn(props)
          : intervalOrFn
        validateInterval(interval)

        if (interval === 0) {
          this.updateStateWithProps(props)
        } else {
          debounce(this.updateStateWithProps, interval, ...debounceArgs)(props)
        }
      }

      render = () => <Component {...this.state.props} />
    }
}
