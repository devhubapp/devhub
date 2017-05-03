// @flow

import React from 'react'

import orientationListener, { Orientation } from '../libs/orientation-listener'

const getComponentName = Component =>
  Component.displayName || Component.name || 'Component'

// eslint-disable-next-line
export default Component =>
  class WithOrientation extends React.PureComponent {
    static displayName = `WithOrientation(${getComponentName(Component)})`

    state = ({
      orientation: 'PORTRAIT',
    }: {
      orientation: Orientation,
    })

    mounted = false

    onOrientationChange = ({ orientation }) => {
      this.setState({ orientation })
    }

    componentDidMount() {
      this.mounted = true

      orientationListener.getOrientation(orientation => {
        if (this.mounted) this.setState({ orientation })
      })

      orientationListener.addListener(this.onOrientationChange)
    }

    componentWillUnmount() {
      this.mounted = false
      orientationListener.removeListener(this.onOrientationChange)
    }

    render() {
      const { orientation } = this.state

      return <Component orientation={orientation} {...this.props} />
    }
  }
