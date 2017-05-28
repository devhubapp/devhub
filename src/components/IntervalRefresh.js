// @flow

import React from 'react'
import moment from 'moment'

export default class IntervalRefresh extends React.Component {
  static defaultProps = {
    interval: 1000,
  }

  state = {
    currentInterval: 1000,
    updatedTimes: 0,
  }

  componentDidMount() {
    this.start()
  }

  componentWillReceiveProps(newProps) {
    const interval = this.getIntervalValue(newProps)

    if (interval !== this.state.currentInterval) {
      this.start(newProps)
    }
  }

  componentWillUnmount() {
    this.stop()
  }

  getIntervalValue({ date, interval: _interval } = {}) {
    let interval

    if (date) {
      const secondsDiff = moment().diff(date, 's')

      if (secondsDiff >= 3600) {
        // each hour
        interval = 3600000
      } else if (secondsDiff >= 60) {
        // each minute
        interval = 60000
      } else {
        // each second
        interval = 1000
      }
    } else if (typeof _interval === 'number') interval = _interval
    else if (typeof _interval === 'function')
      interval = _interval(this.state.updatedTimes)

    return interval
  }

  start = props => {
    this.stop()

    const interval = this.getIntervalValue(props || this.props)
    if (!(interval > 100)) {
      console.error(
        `Invalid interval: ${interval}. Expected a number bigger than 100ms.`,
        { props: this.props },
      )
    }

    this.setState({ currentInterval: interval }, () => {
      this.intervalInstance = setInterval(
        this.tickAndUpdateIntervalIfNecessary,
        this.state.currentInterval,
      )
    })
  }

  stop = () => {
    clearInterval(this.intervalInstance)
  }

  tick = callback => {
    this.setState(
      ({ updatedTimes }) => ({
        updatedTimes: updatedTimes + 1,
      }),
      () => {
        if (callback) {
          const updatedTimes = this.state.updatedTimes
          callback({ updatedTimes })
        }
      },
    )
  }

  tickAndUpdateIntervalIfNecessary = () =>
    this.tick(this.updateIntervalIfNecessary)

  updateIntervalIfNecessary = () => {
    // interval only change dynamically when date prop is passed
    if (!this.props.date) return

    const newInterval = this.getIntervalValue(this.props)
    if (newInterval === this.state.currentInterval) return

    this.start()
  }

  intervalInstance = null

  props: {
    children: Function,
    date?: Date,
    interval?: number, // in miliseconds
  }

  render() {
    const { children, ...props } = this.props
    return children(props)
  }
}
