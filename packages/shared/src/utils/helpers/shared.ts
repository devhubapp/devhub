import _ from 'lodash'
import moment, { MomentInput } from 'moment'
import { toUpper } from 'ramda'
import { PixelRatio } from 'react-native'
import {
  ColumnFilters,
  EnhancedGitHubEvent,
  GitHubEvent,
  GitHubNotification,
} from '../../types'
import { mergeSimilarEvent } from './github/events'

export function capitalize(str: string) {
  return str.toLowerCase().replace(/^.| ./g, toUpper)
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

export function isEventPrivate(event: GitHubEvent) {
  if (!event) return false
  return !!(event.public === false || (event.repo && event.repo.private))
}

export function isNotificationPrivate(notification: GitHubNotification) {
  if (!notification) return false
  return !!(notification.repository && notification.repository.private)
}

export function getFilteredNotifications(
  notifications: GitHubNotification[],
  filters?: ColumnFilters,
) {
  let _notifications = _(notifications)
    .uniqBy('id')
    .orderBy(['unread', 'updated_at', 'created_at'], ['desc', 'desc', 'desc'])
    .value()

  if (!filters) return _notifications

  const hasFilter =
    (filters.notifications &&
      filters.notifications.reasons &&
      Object.values(filters.notifications.reasons).some(v => !v)) ||
    typeof filters.unread === 'boolean' ||
    typeof filters.private === 'boolean'

  if (hasFilter) {
    _notifications = _notifications.filter(notification => {
      if (
        filters.notifications &&
        filters.notifications.reasons &&
        filters.notifications.reasons[notification.reason] === false
      ) {
        return false
      }

      if (
        typeof filters.unread === 'boolean' &&
        filters.unread !== !!notification.unread
      ) {
        return false
      }

      if (
        typeof filters.private === 'boolean' &&
        isNotificationPrivate(notification) !== filters.private
      ) {
        return false
      }

      return true
    })
  }

  return _notifications
}
export function getFilteredEvents(
  events: GitHubEvent[],
  filters?: ColumnFilters,
) {
  let _events = _(events)
    .uniqBy('id')
    .orderBy(['updated_at', 'created_at'], ['desc', 'desc'])
    .value()

  if (!filters) return _events

  const hasFilter =
    (filters.activity &&
      filters.activity.types &&
      Object.values(filters.activity.types).some(v => !v)) ||
    typeof filters.private === 'boolean'

  if (hasFilter) {
    _events = _events.filter(event => {
      if (
        filters.activity &&
        filters.activity.types &&
        filters.activity.types[event.type] === false
      ) {
        return false
      }

      if (
        typeof filters.private === 'boolean' &&
        isEventPrivate(event) !== filters.private
      ) {
        return false
      }

      return true
    })
  }

  return mergeSimilarEvent(_events)
}
