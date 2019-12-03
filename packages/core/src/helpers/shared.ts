import _ from 'lodash'
import moment, { MomentInput } from 'moment'

import {
  ActivityColumnFilters,
  Column,
  ColumnFilters,
  ColumnOptions,
  ColumnSubscription,
  EnhancedGitHubEvent,
  EnhancedGitHubIssueOrPullRequest,
  EnhancedGitHubNotification,
  EnhancedItem,
  GitHubEventAction,
  GitHubItemSubjectType,
  GitHubNotification,
  GitHubStateType,
  IssueOrPullRequestColumnFilters,
  NotificationColumnFilters,
  UserPlan,
} from '../types'
import { getOwnerAndRepoFormattedFilter } from './filters'
import {
  allSubjectTypes,
  eventActions,
  eventSubjectTypes,
  getOwnerAndRepo,
  issueOrPullRequestStateTypes,
  issueOrPullRequestSubjectTypes,
  notificationReasons,
  notificationSubjectTypes,
  sortEvents,
  sortIssuesOrPullRequests,
  sortNotifications,
} from './github'
import { isPlanStatusValid } from './plans'

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

export function getDateSmallText(
  date: MomentInput,
  {
    includeExactTime = false,

    pastPrefix = '',
    pastSuffix = '',
    showPrefixOnFullDate = false,

    futurePrefix = '',
    futureSuffix = '',
    showSuffixOnFullDate = false,
  } = {
    futurePrefix: 'in',
  },
) {
  if (!date) return ''

  const momentDate = moment(date)
  if (!momentDate.isValid()) return ''

  const momentNow = moment(new Date())
  const timeText = momentDate.format('HH:mm')

  const _secondsDiff = momentNow.diff(momentDate, 'seconds')
  const isInFuture = _secondsDiff < 0
  const prefix =
    (isInFuture
      ? futurePrefix && `${futurePrefix} `
      : pastPrefix && `${pastPrefix} `) || ''
  const suffix =
    (isInFuture
      ? futureSuffix && ` ${futureSuffix}`
      : pastSuffix && ` ${pastSuffix}`) || ''
  const fullDatePrefix = showPrefixOnFullDate ? prefix : ''
  const fullDateSuffix = showSuffixOnFullDate ? suffix : ''

  const secondsDiff = Math.abs(_secondsDiff)
  const minutesDiff = Math.abs(momentNow.diff(momentDate, 'minutes'))
  const hoursDiff = Math.abs(
    momentNow.diff(momentDate, 'minutes') >= 60
      ? Math.round(secondsDiff / (60 * 60))
      : Math.floor(secondsDiff / (60 * 60)),
  )
  const daysDiff = Math.abs(
    momentNow.diff(momentDate, 'hours') >= 24
      ? Math.round(secondsDiff / (24 * 60 * 60))
      : Math.floor(secondsDiff / (24 * 60 * 60)),
  )

  if (daysDiff < 1) {
    if (hoursDiff < 1) {
      if (minutesDiff < 1) {
        if (secondsDiff <= 1) {
          return `${fullDatePrefix}now${fullDateSuffix}`
        }

        return `${prefix}${secondsDiff}s${suffix}`
      }

      return `${prefix}${minutesDiff}m${suffix}${
        includeExactTime ? ` (${timeText})` : ''
      }`
    }

    return `${prefix}${hoursDiff}h${suffix}${
      includeExactTime ? ` (${timeText})` : ''
    }`
  }

  if (daysDiff <= 3) {
    return `${prefix}${daysDiff}d${suffix}${
      includeExactTime ? ` (${timeText})` : ''
    }`
  }

  if (momentDate.year() !== moment().year()) {
    return `${fullDatePrefix}${momentDate.format('ll')}${fullDateSuffix}`
  }

  return `${fullDatePrefix}${momentDate.format('MMM Do')}${fullDateSuffix}`
}

// sizes will be multiples of 50 for caching (e.g 50, 100, 150, ...)
export function getSteppedSize(
  size: number | undefined,
  sizeSteps: number | undefined = 50,
  getPixelSizeForLayoutSizeFn: ((size: number) => number) | undefined,
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

export function isIssueOrPullRequestPrivate(
  _issueOrPullRequest: EnhancedGitHubIssueOrPullRequest,
) {
  return !!(_issueOrPullRequest && _issueOrPullRequest.private)
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
  let hasChanged = false
  const result = deepMapper(item, obj => {
    const keys = Object.keys(obj)

    keys.forEach(key => {
      if (!(key && typeof key === 'string')) return
      if (
        !(key.includes('_url') || key.includes('_link') || key.includes('href'))
      )
        return

      if (!urlsToKeep.includes(key)) {
        hasChanged = true
        delete (obj as any)[key]
      }
    })

    return obj
  })

  if (!hasChanged) return item
  return result
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
  if (!(md && typeof md === 'string')) return ''

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

export function getSubscriptionOwnerOrOrg(
  subscription: ColumnSubscription | undefined,
) {
  if (!(subscription && subscription.params)) return undefined

  if ('owner' in subscription.params && subscription.params.owner)
    return subscription.params.owner

  if ('org' in subscription.params && subscription.params.org)
    return subscription.params.org

  const {
    allIncludedOwners,
    allIncludedRepos,
  } = getOwnerAndRepoFormattedFilter(
    'owners' in subscription.params
      ? { owners: subscription.params.owners }
      : undefined,
  )

  const _org = allIncludedOwners.length === 1 ? allIncludedOwners[0] : undefined
  const _ownerAndRepo =
    allIncludedRepos.length === 1
      ? getOwnerAndRepo(allIncludedOwners[0])
      : { owner: undefined, repo: undefined }

  return _org || _ownerAndRepo.owner || undefined
}

export function getSearchQueryFromFilter(
  type: Column['type'],
  filters: ColumnFilters | undefined,
  { groupByKey = false } = {},
): string {
  if (!(type && filters)) return ''

  const queries: string[] = []

  const {
    // clearedAt,
    bot,
    draft,
    owners,
    private: _private,
    query,
    saved,
    state: states,
    subjectTypes,
    unread,
  } = filters

  const { activity, watching } = filters as ActivityColumnFilters
  const { involves } = filters as IssueOrPullRequestColumnFilters
  const { notifications } = filters as NotificationColumnFilters

  function getMaybeNegate(filter: boolean | null | undefined) {
    return filter === false ? '-' : ''
  }

  function handleRecordFilter(
    queryKey: string,
    filterRecord: Record<string, boolean | undefined> | undefined,
    transform?: (
      key: string,
      value: boolean | undefined,
    ) => [string, boolean | undefined],
  ) {
    if (!filterRecord) return

    const include: string[] = []
    const exclude: string[] = []
    Object.entries(filterRecord).forEach(params => {
      const [_item, value] = transform
        ? transform(params[0], params[1])
        : params

      const item = `${_item || ''}`.toLowerCase().trim()
      if (!(item && typeof value === 'boolean')) return

      if (value) include.push(item)
      else if (value === false) exclude.push(item)
    })

    if (groupByKey) {
      if (include.length)
        queries.push(`${queryKey}:${_.sortBy(include).join(',')}`)
      if (exclude.length)
        queries.push(`-${queryKey}:${_.sortBy(exclude).join(',')}`)
    } else {
      const all = _.sortBy(_.uniq([...include, ...exclude])).filter(Boolean)
      all.forEach(value =>
        queries.push(
          `${exclude.includes(value) ? '-' : ''}${queryKey}:${value}`,
        ),
      )
    }
  }

  const inbox = getItemInbox(type, filters)
  if (inbox !== 'all' || type === 'notifications') {
    queries.push(`inbox:${inbox}`)
  }

  if (owners) {
    const { ownerFilters, repoFilters } = getOwnerAndRepoFormattedFilter({
      owners,
    })

    handleRecordFilter('owner', ownerFilters)
    handleRecordFilter('repo', repoFilters)
  }

  if (involves) {
    handleRecordFilter('involves', involves)
  }

  if (typeof saved === 'boolean') {
    const n = getMaybeNegate(saved)
    queries.push(`${n}is:saved`)
  }

  if (unread === true) queries.push('is:unread')
  if (unread === false) queries.push('is:read')

  if (typeof _private === 'boolean')
    queries.push(_private ? 'is:private' : 'is:public')

  if (subjectTypes)
    handleRecordFilter('is', subjectTypes, (_key, value) => {
      const key = `${_key || ''}`.toLowerCase().trim()
      if (key === 'pullrequest') return ['pr', value]
      return [key, value]
    })

  if (states) handleRecordFilter('is', states)

  if (typeof bot === 'boolean') {
    const n = getMaybeNegate(bot)
    queries.push(`${n}is:bot`)
  }

  if (typeof draft === 'boolean') {
    const n = getMaybeNegate(draft)
    queries.push(`${n}is:draft`)
  }

  if (notifications && notifications.reasons)
    handleRecordFilter('reason', notifications.reasons, (k, v) => [
      k && k.toLowerCase() === 'subscribed' ? 'watching' : k,
      v,
    ])

  if (activity && activity.actions)
    handleRecordFilter('action', activity.actions)

  if (watching) handleRecordFilter('watching', watching)

  // if (clearedAt) queries.push(`clear:${clearedAt}`)

  const queryTerms = getSearchQueryTerms(query)
  let remainingQuery = ''
  const queryObj: Record<string, Record<string, boolean>> = {}
  queryTerms.forEach(queryTerm => {
    if (!queryTerm) return

    if (queryTerm.length === 2) {
      const [q, isNegated] = queryTerm
      remainingQuery = `${remainingQuery.trim()} ${
        isNegated ? '-' : ''
      }${q}`.trim()
    } else if (queryTerm.length === 3) {
      const [k, v, isNegated] = queryTerm
      queryObj[k] = queryObj[k] || {}
      queryObj[k][v] = !isNegated
    }
  })

  Object.entries(queryObj).forEach(([queryKey, filterRecord]) => {
    handleRecordFilter(queryKey, filterRecord)
  })

  if (remainingQuery) queries.push(remainingQuery.trim())

  return queries.join(' ')
}

export function getQueryStringFromQueryTerms(
  queryTerms: Array<[string, boolean] | [string, string, boolean]>,
) {
  let query = ''
  queryTerms.forEach(queryTerm => {
    if (!queryTerm) return

    if (queryTerm.length === 2) {
      const [q, isNegated] = queryTerm
      query = `${query.trim()} ${isNegated ? '-' : ''}${q}`.trim()
    } else if (queryTerm.length === 3) {
      const [k, v, isNegated] = queryTerm
      query = `${query.trim()} ${isNegated ? '-' : ''}${k}:${v}`.trim()
    }
  })

  return query
}

export function getSearchQueryTerms(
  query: string | undefined,
): Array<[string, boolean] | [string, string, boolean]> {
  if (!(query && typeof query === 'string')) return []

  const result: Array<[string, boolean] | [string, string, boolean]> = []

  const q = query.replace(/(^|\s)NOT(\s)/gi, '$1-').trim()

    // TODO: Fix regex with backslash
    // ;(q.match(/("-?([^\\][^"])+")/g) || []).forEach((str, index) => {
    //   if (!str) return
    //   q = q.replace(str, '')
    //   strings.push(str.trim())
    // })
  ;(
    q.match(
      /(-?[a-zA-Z]+:"[^"]+")|(-?[a-zA-Z]+:[^ \n$]+)|(-?"[^"]+")|([^ $]+)/g,
    ) || []
  ).forEach(queryItem => {
    if (!queryItem) return

    const [_keyOrValue, ..._values] =
      queryItem[0] === '"' || (queryItem[0] === '-' && queryItem[1] === '"')
        ? [queryItem]
        : queryItem.split(':')

    const isNegated = !!(_keyOrValue && _keyOrValue[0] === '-')
    const keyOrValue = (_keyOrValue || '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()
      .slice(isNegated ? 1 : 0)
    const value = _values
      .join(':')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()

    function handleValue(v: string) {
      if (keyOrValue && !v) {
        result.push([keyOrValue, isNegated])
      } else if (keyOrValue && v) {
        result.push([keyOrValue, v, isNegated])
      }
    }

    // handle queries with comma, like: owner:facebook,styled-components
    // by splitting them into: owner:facebook owner:styled-components
    if (
      keyOrValue &&
      value &&
      !value.startsWith('"') &&
      value.split(',').length > 1
    ) {
      value.split(',').map(subItem => subItem && handleValue(subItem.trim()))
    } else {
      handleValue(value)
    }
  })

  return result
}

export function getFilterFromSearchQuery(
  type: Column['type'],
  query: string | undefined,
  otherFilters?: Pick<ColumnFilters, 'clearedAt'> | undefined,
): ColumnFilters {
  const filters: ColumnFilters = {
    ...otherFilters,
  }

  if (!type) return filters

  const searchTerms = getSearchQueryTerms(query)

  let unknownKeyValueQueries = ''
  filters.query = ''

  searchTerms.forEach(searchTerm => {
    if (Array.isArray(searchTerm) && searchTerm.length === 2) {
      const [_query, _isNegated] = searchTerm
      if (
        !(
          _query &&
          typeof _query === 'string' &&
          typeof _isNegated === 'boolean'
        )
      )
        return

      const _str = `${_isNegated ? '-' : ''}${_query}`
      filters.query = `${filters.query} ${_str}`.trim()
      return
    }

    if (!(Array.isArray(searchTerm) && searchTerm.length === 3)) return

    const [key, value, isNegated] = searchTerm

    if (
      !(
        key &&
        value &&
        typeof key === 'string' &&
        typeof value === 'string' &&
        typeof isNegated === 'boolean'
      )
    )
      return

    const activityFilters = filters as ActivityColumnFilters
    const issueOrPRFilters = filters as IssueOrPullRequestColumnFilters
    const notificationsFilters = filters as NotificationColumnFilters

    switch (key) {
      case 'inbox': {
        const inbox = `${value || ''}`.toLowerCase().trim()

        if (type === 'notifications') {
          notificationsFilters.notifications =
            notificationsFilters.notifications || {}
          notificationsFilters.notifications.participating =
            inbox === 'participating'
        }
        break
      }

      case 'org':
      case 'owner':
      case 'user': {
        const owner = `${value || ''}`.toLowerCase().trim()
        filters.owners = filters.owners || {}
        filters.owners[owner] = filters.owners[owner] || {
          repos: {},
          value: undefined,
        }
        filters.owners[owner]!.value = !isNegated
        break
      }

      case 'repo': {
        const repoFullName = `${value || ''}`.toLowerCase().trim()
        const { owner, repo } = getOwnerAndRepo(repoFullName)
        if (!(owner && repo)) return

        filters.owners = filters.owners || {}
        filters.owners[owner] = filters.owners[owner] || {
          repos: {},
          value: undefined,
        }
        filters.owners[owner]!.repos = filters.owners[owner]!.repos || {}
        filters.owners[owner]!.repos![repo] = !isNegated
        break
      }

      case 'involves': {
        const user = `${value || ''}`.toLowerCase().trim()
        issueOrPRFilters.involves = issueOrPRFilters.involves || {}
        issueOrPRFilters.involves[user] = !isNegated
        break
      }

      case 'is': {
        switch (value) {
          case 'saved': {
            filters.saved = !isNegated
            break
          }

          case 'unread': {
            filters.unread = !isNegated
            break
          }

          case 'read': {
            filters.unread = !!isNegated
            break
          }

          case 'public': {
            filters.private = !!isNegated
            break
          }

          case 'private': {
            filters.private = !isNegated
            break
          }

          case 'bot': {
            filters.bot = !isNegated
            break
          }

          case 'draft': {
            filters.draft = !isNegated
            break
          }

          case 'open': {
            filters.state = filters.state || {}
            filters.state.open = !isNegated
            break
          }

          case 'closed': {
            filters.state = filters.state || {}
            filters.state.closed = !isNegated
            break
          }

          case 'merged': {
            filters.state = filters.state || {}
            filters.state.merged = !isNegated
            break
          }

          case 'pr': {
            filters.subjectTypes = filters.subjectTypes || {}
            ;(filters.subjectTypes as Record<
              GitHubItemSubjectType,
              boolean
            >).PullRequest = !isNegated
            break
          }

          default: {
            const validSubjectTypes =
              type === 'activity'
                ? eventSubjectTypes
                : type === 'issue_or_pr'
                ? issueOrPullRequestSubjectTypes
                : type === 'notifications'
                ? notificationSubjectTypes
                : allSubjectTypes

            if (
              validSubjectTypes
                .map(subjectType => subjectType.toLowerCase())
                .includes(value)
            ) {
              filters.subjectTypes = filters.subjectTypes || {}

              validSubjectTypes.forEach(subjectType => {
                if (subjectType.toLowerCase() === value) {
                  ;(filters.subjectTypes as Record<
                    GitHubItemSubjectType,
                    boolean
                  >)[subjectType] = !isNegated
                }
              })
              break
            }

            // TODO: Investigate
            // for some reason that I don't know,
            // the code was not going to the next "default" here,
            // so I had to copy-paste the code code below
            if (key && value) {
              const q = `${isNegated ? '-' : ''}${key}:${value}`
              unknownKeyValueQueries = `${unknownKeyValueQueries} ${q}`.trim()
              break
            }
          }
        }
      }

      case 'action': {
        if (type !== 'activity') return

        const action = `${value || ''}`.toLowerCase().trim() as
          | GitHubEventAction
          | string

        activityFilters.activity = activityFilters.activity || {}
        activityFilters.activity.actions =
          activityFilters.activity.actions || {}

        // invalid
        if (!eventActions.includes(action as GitHubEventAction)) return

        activityFilters.activity.actions[
          action as GitHubEventAction
        ] = !isNegated
        break
      }

      case 'state': {
        const state = `${value || ''}`.toLowerCase().trim() as
          | GitHubStateType
          | string

        filters.state = filters.state || {}

        // invalid
        if (!issueOrPullRequestStateTypes.includes(state as GitHubStateType))
          return

        filters.state[state as GitHubStateType] = !isNegated
        break
      }

      case 'type': {
        const subjectType = `${value || ''}`.toLowerCase().trim() as
          | GitHubItemSubjectType
          | string

        filters.subjectTypes = filters.subjectTypes || {}
        const subjectTypesFilter = filters.subjectTypes as Record<
          GitHubItemSubjectType,
          boolean
        >

        // invalid
        if (!allSubjectTypes.includes(subjectType as GitHubItemSubjectType))
          return

        subjectTypesFilter[subjectType as GitHubItemSubjectType] = !isNegated
        break
      }

      case 'reason': {
        if (type !== 'notifications') return

        let reason = `${value || ''}`.toLowerCase().trim() as
          | EnhancedGitHubNotification['reason']
          | string
        if (reason === 'watching') reason = 'subscribed'

        notificationsFilters.notifications =
          notificationsFilters.notifications || {}
        notificationsFilters.notifications.reasons =
          notificationsFilters.notifications.reasons || {}
        const reasonsFilter = notificationsFilters.notifications
          .reasons as Record<EnhancedGitHubNotification['reason'], boolean>

        // invalid
        if (
          !notificationReasons.includes(
            reason as EnhancedGitHubNotification['reason'],
          )
        )
          return

        reasonsFilter[
          reason as EnhancedGitHubNotification['reason']
        ] = !isNegated
        break
      }

      case 'watching': {
        if (type !== 'activity') return

        const owner = `${value || ''}`.toLowerCase().trim()

        activityFilters.watching = activityFilters.watching || {}
        activityFilters.watching[owner] = !isNegated
        break
      }

      default: {
        if (key && value) {
          const q = `${isNegated ? '-' : ''}${key}:${value}`
          unknownKeyValueQueries = `${unknownKeyValueQueries} ${q}`.trim()
        }

        return
      }
    }
  })

  filters.query = filters.query || ''
  if (unknownKeyValueQueries)
    filters.query = `${unknownKeyValueQueries} ${filters.query}`.trim()

  return filters
}

export function getValuesFromQueryKeysFilter(
  type: Column['type'],
  queryKeys: string[],
  filters: ColumnFilters | undefined,
) {
  const filtersQuery =
    getSearchQueryFromFilter(type, filters, {
      groupByKey: true,
    }) || undefined
  const queryTerms = getSearchQueryTerms(filtersQuery)

  const filteredQueryTerms = (_.sortBy(
    queryTerms.filter(
      queryTerm =>
        queryTerm &&
        queryTerm.length === 3 &&
        queryKeys.includes(queryTerm[0] as any),
    ),
    ['0', '2'],
  ) as any) as Array<[string, string, boolean]>
  const usedQueryKeys = _.uniq(
    filteredQueryTerms.map(queryTerm => queryTerm[0]),
  )

  const filterObjs: Record<
    'including' | 'excluding',
    Record<string, string[]>
  > = {
    including: {},
    excluding: {},
  }
  filteredQueryTerms.forEach(queryTerm => {
    const [key, value, isNegated] = queryTerm

    if (isNegated) {
      filterObjs.excluding[key] = filterObjs.excluding[key] || []
      filterObjs.excluding[key]!.push(value)
    } else {
      filterObjs.including[key] = filterObjs.including[key] || []
      filterObjs.including[key]!.push(value)
    }
  })

  let included: string[] = []
  Object.entries(filterObjs.including).forEach(([_queryKey, _usernames]) => {
    included = _.uniq(included.concat(_usernames))
  })

  let excluded: string[] = []
  Object.entries(filterObjs.excluding).forEach(([_queryKey, _usernames]) => {
    excluded = _.uniq(excluded.concat(_usernames))
  })

  return {
    all: _.uniq(included.concat(excluded)),
    included,
    excluded,
    usedQueryKeys,
  }
}

type UsernameFilterKey =
  | 'assignee'
  | 'author'
  | 'commenter'
  | 'involves'
  | 'mentions'
  | 'org'
  | 'owner'
  | 'review-requested'
  | 'reviewed-by'
  | 'team'
  | 'team-review-requested'
  | 'user'
  | 'watching'
export function getUsernamesFromFilter(
  type: Column['type'],
  filters: ColumnFilters | undefined,
  {
    blacklist = [],
    whitelist = [
      'assignee',
      'author',
      'commenter',
      'involves',
      'mentions',
      'org',
      'owner',
      'review-requested',
      'reviewed-by',
      'team',
      'team-review-requested',
      'user',
      'watching',
    ],
  }: { blacklist?: UsernameFilterKey[]; whitelist?: UsernameFilterKey[] } = {},
) {
  const usernameFilterKeys = whitelist.filter(key => !blacklist.includes(key))

  const {
    all,
    excluded,
    included,
    usedQueryKeys,
  } = getValuesFromQueryKeysFilter(type, usernameFilterKeys, filters)

  return {
    allUsernames: all,
    excludedUsernames: excluded,
    includedUsernames: included,
    usernameFilterKeys,
    usedUsernameFilterKeys: usedQueryKeys,
  }
}

export function getItemsFromSubscriptions(
  subscriptions: ColumnSubscription[],
  getItemByNodeIdOrId: (nodeIdOrId: string) => EnhancedItem | undefined,
): EnhancedItem[] {
  const itemNodeIdOrIds: string[] = []
  const result: EnhancedItem[] = []

  if (!(subscriptions && subscriptions.length)) return result

  subscriptions.forEach(subscription => {
    if (
      !(
        subscription &&
        subscription.data &&
        subscription.data.itemNodeIdOrIds &&
        subscription.data.itemNodeIdOrIds.length
      )
    )
      return

    subscription.data.itemNodeIdOrIds.forEach(_id => {
      const id = `${_id || ''}`
      if (!id) return

      if (itemNodeIdOrIds.includes(id)) return

      const item = getItemByNodeIdOrId(id)
      if (!item) return

      itemNodeIdOrIds.push(id)
      result.push(item)
    })
  })

  if (!result.length) return result

  if (subscriptions[0] && subscriptions[0]!.type === 'activity') {
    return sortEvents(result as EnhancedGitHubEvent[])
  }

  if (subscriptions[0] && subscriptions[0]!.type === 'issue_or_pr') {
    return sortIssuesOrPullRequests(
      result as EnhancedGitHubIssueOrPullRequest[],
    )
  }

  if (subscriptions[0] && subscriptions[0]!.type === 'notifications') {
    return sortNotifications(result as EnhancedGitHubNotification[])
  }

  console.error(`Unhandled subscription type: ${subscriptions[0]!.type}`)
  return result
}

export function getItemInbox(type: Column['type'], filters: Column['filters']) {
  if (type === 'notifications') {
    const f = filters as NotificationColumnFilters

    return f && f.notifications && f.notifications.participating
      ? 'participating'
      : 'all'
  }

  return 'all'
}

export function getColumnOptionMetadata({
  Platform,
  plan,
}: {
  Platform: { OS: 'web' | 'ios' | 'android'; isElectron: boolean }
  plan: Pick<UserPlan, 'amount' | 'featureFlags' | 'status'> | null | undefined
}): Record<
  keyof ColumnOptions,
  {
    hasAccess: boolean | 'trial'
    platformSupports: boolean
  }
> {
  return {
    enableAppIconUnreadIndicator: {
      hasAccess: true,
      platformSupports: Platform.OS === 'web',
    },
    enableInAppUnreadIndicator: {
      hasAccess: true,
      platformSupports: true,
    },
    enableDesktopPushNotifications: {
      hasAccess: !!(plan &&
      isPlanStatusValid(plan) &&
      plan.featureFlags &&
      plan.featureFlags.enablePushNotifications
        ? plan.status === 'trialing' && !plan.amount
          ? 'trial'
          : true
        : false),
      platformSupports: Platform.isElectron,
    },
  }
}

export function getColumnOption<O extends keyof ColumnOptions>(
  column: Column | undefined,
  option: O,
  {
    Platform,
    plan,
  }: {
    Platform: { OS: 'web' | 'ios' | 'android'; isElectron: boolean }
    plan:
      | Pick<UserPlan, 'amount' | 'featureFlags' | 'status'>
      | null
      | undefined
  },
): {
  hasAccess: boolean | 'trial'
  platformSupports: boolean
  value: ColumnOptions[O] | undefined
} {
  if (!(column && column.type))
    return { hasAccess: false, platformSupports: false, value: undefined }

  const details = getColumnOptionMetadata({ Platform, plan })

  if (option === 'enableAppIconUnreadIndicator') {
    return {
      ...details.enableAppIconUnreadIndicator,
      value:
        column.options &&
        typeof column.options.enableAppIconUnreadIndicator === 'boolean'
          ? column.options.enableAppIconUnreadIndicator
          : Platform.OS === 'web'
          ? column.type === 'notifications'
          : false,
    }
  }

  if (option === 'enableInAppUnreadIndicator') {
    return {
      ...details.enableInAppUnreadIndicator,
      value:
        column.options &&
        typeof column.options.enableInAppUnreadIndicator === 'boolean'
          ? column.options.enableInAppUnreadIndicator
          : true,
    }
  }

  if (option === 'enableDesktopPushNotifications') {
    return {
      ...details.enableDesktopPushNotifications,
      value:
        column.options &&
        typeof column.options.enableDesktopPushNotifications === 'boolean'
          ? column.options.enableDesktopPushNotifications
          : Platform.isElectron
          ? column.type === 'notifications'
          : false,
    }
  }

  return {
    hasAccess: false,
    platformSupports: false,
    value: column.options && column.options[option],
  }
}

export function fixDateToISO(
  date: Date | number | string | undefined | null,
): string | undefined {
  if (!date) return undefined

  let _date = date
  if (typeof _date === 'string') _date = new Date(_date)

  let timestamp: number | null = null
  if (_date instanceof Date) timestamp = _date.getTime()
  if (typeof _date === 'number') timestamp = _date
  if (timestamp && timestamp.toString().length <= 10)
    timestamp = timestamp * 1000 + new Date().getTimezoneOffset() * 60 * 1000
  if (date && typeof date === 'string' && !date.includes('Z') && timestamp)
    timestamp = timestamp + new Date().getTimezoneOffset() * 60 * 1000

  if (!(timestamp && timestamp.toString().length >= 13)) return undefined

  return new Date(timestamp).toISOString()
}
// new Date(new Date('2019-11-24 22:48:21').getTime() + (new Date().getTimezoneOffset() * 60 * 1000))
