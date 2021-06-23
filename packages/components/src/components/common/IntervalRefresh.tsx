import moment, { MomentInput } from 'moment'
import { useEffect, useRef, useState } from 'react'

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

  const secondsDiff = Math.abs(moment().diff(date, 's'))

  // each 10 minutes
  if (secondsDiff >= 6000) {
    return 600000
  }

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

  const timerRef = useRef(-1)

  useEffect(() => {
    clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setUpdatedTimes((prevValue) => prevValue + 1)
    }, interval) as any as number

    return () => clearInterval(timerRef.current)
  }, [interval])

  return children()
}
