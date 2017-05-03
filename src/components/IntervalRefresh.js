// @flow

import React from 'react'

export default class extends React.Component {
  state = {
    updatedTimes: 0,
  }

  componentDidMount() {
    const interval = this.getIntervalValue()

    if (interval < 500) {
      console.warn(`The interval prop received is too small: ${interval}ms`)
    }

    this.startTimeout()
  }

  componentWillReceiveProps({ interval: _interval }) {
    const interval = this.getIntervalValue(_interval)

    if (interval !== this.props.interval) {
      this.startTimeout(interval)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutInstance)
  }

  getIntervalValue(_interval) {
    const interval = _interval !== undefined ? _interval : this.props.interval
    if (typeof interval === 'function') return interval(this.state.updatedTimes)
    return interval
  }

  startTimeout = _interval => {
    clearTimeout(this.timeoutInstance)

    const interval = this.getIntervalValue(_interval)
    if (!(interval > 0)) return

    this.timeoutInstance = setTimeout(
      () => this.tick(this.startTimeout),
      interval,
    )
  }

  tick = callback => {
    const updatedTimes = this.state.updatedTimes + 1
    this.setState({ updatedTimes }, () => {
      // this.forceUpdate();
      if (typeof callback === 'function') callback()
    })
  }

  timeoutInstance = null

  props: {
    interval: number, // in miliseconds
    onRender: React.PropTypes.func,
  }

  render() {
    const { onRender, ...props } = this.props

    if (typeof onRender !== 'function') return null
    return onRender(props)
  }
}
