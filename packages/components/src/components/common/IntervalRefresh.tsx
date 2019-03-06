import moment, { MomentInput } from 'moment'
import { useEffect, useState } from 'react'

export interface IntervalRefreshProps {
  children: () => any
  date?: MomentInput
  interval?: number
}

export interface IntervalRefreshState {
  currentInterval: number
  updatedTimes: number
}

const defaultInterval = 1000

function getIntervalFromDate(date: IntervalRefreshProps['date']) {
  if (!date) return

  const secondsDiff = moment().diff(date, 's')

  // // each hour
  // if (secondsDiff >= 3600) {
  //   return 3600000
  // }

  // each minute
  if (secondsDiff >= 60) {
    return 60000
  }

  // each second
  return 1000
}

export function IntervalRefresh(props: IntervalRefreshProps) {
  const { children, date, interval: _interval } = props

  const interval = _interval || getIntervalFromDate(date) || defaultInterval

  if (_interval && !(_interval >= 500)) {
    console.error(
      `Invalid interval: ${_interval}. Expected at least 500ms. Default: ${defaultInterval}.`,
    )
  }

  const [, setUpdatedTimes] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setUpdatedTimes(prevValue => prevValue + 1)
    }, interval)

    return () => clearInterval(timer)
  }, [interval])

  return children()
}
