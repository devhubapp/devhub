import _ from 'lodash'
import moment, { MomentInput } from 'moment'

import { EnhancedGitHubEvent, GitHubNotification } from '..'

export function capitalize(str: string) {
  return str.toLowerCase().replace(/^.| ./g, _.toUpper)
}

export function memoizeMultipleArgs<FN extends (...args: any[]) => any>(
  fn: FN,
): FN {
  return _.memoize(fn, (...args) => JSON.stringify(args))
}

export function guid() {
  const str4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) // tslint:disable-line
  return `${str4() +
    str4()}-${str4()}-${str4()}-${str4()}-${str4()}${str4()}${str4()}`
}

export function isNight() {
  const hours = new Date().getHours()
  return hours >= 18 || hours <= 6
}

export function getDateSmallText(date: MomentInput) {
  if (!date) return ''

  const momentDate = moment(date)
  if (!momentDate.isValid()) return ''

  const momentNow = moment(new Date())
  const daysDiff = momentNow.diff(momentDate, 'days')
  const timeText = momentDate.format('HH:mm')
  // return `${momentNow.diff(momentDate, 'seconds')}s`

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
export function getSteppedSize(
  size?: number,
  sizeSteps = 50,
  getPixelSizeForLayoutSizeFn?: (size: number) => number,
) {
  const steppedSize =
    typeof size === 'number'
      ? sizeSteps * Math.max(1, Math.ceil(size / sizeSteps))
      : sizeSteps

  return getPixelSizeForLayoutSizeFn
    ? getPixelSizeForLayoutSizeFn(steppedSize)
    : steppedSize
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

export function isEventPrivate(event: EnhancedGitHubEvent) {
  if (!event) return false
  return !!(
    event.public === false ||
    ('repo' in event && event.repo && event.repo.private) ||
    ('repos' in event && event.repos && event.repos.some(repo => repo.private))
  )
}

export function isNotificationPrivate(notification: GitHubNotification) {
  if (!notification) return false
  return !!(notification.repository && notification.repository.private)
}

export function deepMapper<T extends object, R = T>(
  obj: T,
  mapper: (obj: T) => any,
): R {
  if (!(obj && _.isPlainObject(obj))) return obj as any

  return mapper(_.mapValues(obj, v =>
    _.isPlainObject(v) ? deepMapper(v as any, mapper) : v,
  ) as any)
}

const urlsToKeep = ['url', 'html_url', 'avatar_url', 'latest_comment_url']
export function removeUselessURLsFromResponseItem(item: object) {
  return deepMapper(item, obj => {
    const keys = Object.keys(obj)

    keys.forEach(key => {
      if (!(key && typeof key === 'string')) return
      if (
        !(key.includes('_url') || key.includes('_link') || key.includes('href'))
      )
        return

      if (!urlsToKeep.includes(key)) {
        delete (obj as any)[key]
      }
    })
    return obj
  })
}
