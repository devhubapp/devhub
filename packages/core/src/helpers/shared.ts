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
  return hours >= 18 || hours < 6
}

export function getFullDateText(date: MomentInput) {
  if (!date) return ''

  const momentDate = moment(date)
  if (!momentDate.isValid()) return ''

  return momentDate.format('llll')
}

export function getDateSmallText(date: MomentInput, includeExactTime = false) {
  if (!date) return ''

  const momentDate = moment(date)
  if (!momentDate.isValid()) return ''

  const momentNow = moment(new Date())
  const timeText = momentDate.format('HH:mm')

  const secondsDiff = momentNow.diff(momentDate, 'seconds')
  const minutesDiff = momentNow.diff(momentDate, 'minutes')
  const hoursDiff =
    momentNow.diff(momentDate, 'minutes') >= 60
      ? Math.round(secondsDiff / (60 * 60))
      : Math.floor(secondsDiff / (60 * 60))
  const daysDiff =
    momentNow.diff(momentDate, 'hours') >= 24
      ? Math.round(secondsDiff / (24 * 60 * 60))
      : Math.floor(secondsDiff / (24 * 60 * 60))

  if (daysDiff < 1) {
    if (hoursDiff < 1) {
      if (minutesDiff < 1) {
        if (secondsDiff <= 1) {
          return 'now'
        }

        return `${secondsDiff}s`
      }

      return `${minutesDiff}m${includeExactTime ? ` (${timeText})` : ''}`
    }

    return `${hoursDiff}h${includeExactTime ? ` (${timeText})` : ''}`
  }

  if (daysDiff <= 3) {
    return `${daysDiff}d${includeExactTime ? ` (${timeText})` : ''}`
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

export function trimNewLinesAndSpaces(text?: string, maxLength: number = 120) {
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
export function removeUselessURLsFromResponseItem<
  T extends Record<string, any>
>(item: T) {
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

// Modified version of: https://github.com/stiang/remove-markdown
// License: MIT
export function stripMarkdown(
  md: string,
  _options?: {
    listUnicodeChar?: boolean
    stripListLeaders?: boolean
    githubFlavoredMarkdown?: boolean
    useImgAltText?: boolean
  },
) {
  const options = _options || {}

  options.listUnicodeChar = options.hasOwnProperty('listUnicodeChar')
    ? options.listUnicodeChar
    : false

  options.stripListLeaders = options.hasOwnProperty('stripListLeaders')
    ? options.stripListLeaders
    : true

  options.githubFlavoredMarkdown = options.hasOwnProperty('gfm')
    ? options.githubFlavoredMarkdown
    : true

  options.useImgAltText = options.hasOwnProperty('useImgAltText')
    ? options.useImgAltText
    : true

  let output = md || ''

  // Remove horizontal rules (stripListHeaders conflict with this rule, which is why it has been moved to the top)
  output = output.replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*$/gm, '')

  try {
    if (options.stripListLeaders) {
      if (options.listUnicodeChar)
        output = output.replace(
          /^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm,
          `${options.listUnicodeChar} $1`,
        )
      else output = output.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, '$1')
    }
    if (options.githubFlavoredMarkdown) {
      output = output
        // Header
        .replace(/\n={2,}/g, '\n')
        // Fenced codeblocks
        .replace(/~{3}.*\n/g, '')
        // Strikethrough
        .replace(/~~/g, '')
        // Fenced codeblocks
        .replace(/`{3}.*\n/g, '')
    }
    output = output
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove Comments
      .replace(/<[^>]*>/g, '')
      .replace(/\>(.*)([\r\n]+|$)/g, '')
      // Remove setext-style headers
      .replace(/^[=\-]{2,}\s*$/g, '')
      // Remove footnotes?
      .replace(/\[\^.+?\](\: .*?$)?/g, '')
      .replace(/\s{0,2}\[.*?\]: .*?$/g, '')
      // Remove images
      .replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, options.useImgAltText ? '$1' : '')
      // Remove inline links
      .replace(/\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
      // Remove blockquotes
      .replace(/^\s{0,3}>\s?/g, '')
      // Remove reference-style links?
      .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, '')
      // Remove atx-style headers
      .replace(
        /^(\n)?\s{0,}#{1,6}\s+| {0,}(\n)?\s{0,}#{0,} {0,}(\n)?\s{0,}$/gm,
        '$1$2$3',
      )
      // Remove emphasis (repeat the line to remove double emphasis)
      .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      // Remove code blocks
      .replace(/(`{3,})(.*?)\1/gm, '$2')
      // Remove inline code
      .replace(/`(.+?)`/g, '$1')
      .replace(/`/g, '')
      // Replace two or more newlines with exactly two? Not entirely sure this belongs here...
      .replace(/\n{2,}/g, '\n\n')
  } catch (e) {
    console.error(e)
    return md
  }
  return output
}

export function normalizeUsername(username: string | undefined) {
  if (!username || typeof username !== 'string') return undefined
  return username.trim().toLowerCase()
}

export function convertObjectKeysToCamelCase<T extends Record<string, any>>(
  obj: T,
): Record<string, any> {
  return _.mapKeys(obj, (_value, key) => _.camelCase(key))
}

export function genericGitHubResponseMapper(
  response: Record<string, any> | undefined,
): Record<string, any> | undefined {
  if (!(response && _.isPlainObject(response))) return response

  return _.mapValues(convertObjectKeysToCamelCase(response), obj => {
    if (_.isPlainObject(obj)) return genericGitHubResponseMapper(obj)
    return obj
  })
}

export function intercalateWithArray<T extends any[], U>(arr: T, separator: U) {
  return _.flatMap(arr, (item, index) =>
    index === 0 ? item : [separator, item],
  )
}
