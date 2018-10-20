import moment, { MomentInput } from 'moment'
import { toUpper } from 'ramda'
import { PixelRatio } from 'react-native'

export function capitalize(str: string) {
  return str.toLowerCase().replace(/^.| ./g, toUpper)
}

export function isNight() {
  const hours = new Date().getHours()
  return hours >= 18 || hours <= 6
}

export function getDateSmallText(date: MomentInput) {
  if (!date) return ''

  const momentDate = moment(date)
  if (!momentDate.isValid()) return ''
  // return `${moment(new Date()).diff(momentDate, 'seconds')}s`;

  const momentNow = moment(new Date())
  const daysDiff = momentNow.diff(momentDate, 'days')
  const timeText = momentDate.format('HH:mm')

  if (daysDiff < 1) {
    const hoursDiff = momentNow.diff(momentDate, 'hours')

    if (hoursDiff < 1) {
      const minutesDiff = momentNow.diff(momentDate, 'minutes')

      if (minutesDiff < 1) {
        const secondsDiff = momentNow.diff(momentDate, 'seconds')
        if (secondsDiff < 10) {
          return 'now'
        }

        return `${secondsDiff}s`
      }

      // if (minutesDiff < 30) {
      //   return `${minutesDiff}m`;
      // }

      return `${minutesDiff}m (${timeText})`
    }

    return `${hoursDiff}h (${timeText})`
  }

  if (daysDiff <= 3) {
    return `${daysDiff}d (${timeText})`
  }

  return momentDate.format('MMM Do').toLowerCase()
}

// sizes will be multiples of 50 for caching (e.g 50, 100, 150, ...)
export function getSteppedSize(size?: number, sizeSteps = 50) {
  const steppedSize =
    typeof size === 'number'
      ? sizeSteps * Math.max(1, Math.ceil(size / sizeSteps))
      : sizeSteps

  return PixelRatio.getPixelSizeForLayoutSize(steppedSize)
}

export function randomBetween(minNumber: number, maxNumber: number) {
  return Math.floor(Math.random() * maxNumber) + minNumber
}

export function trimNewLinesAndSpaces(text?: string, maxLength: number = 100) {
  if (!text || typeof text !== 'string') return ''

  let newText = text.replace(/\s+/g, ' ').trim()
  if (maxLength > 0 && newText.length > maxLength) {
    newText = `${newText.substr(0, maxLength).trim()}...`
  }

  return newText
}
