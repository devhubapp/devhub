import axios from 'axios'
import immer from 'immer'
import _ from 'lodash'

import {
  EnhancedGitHubIssueOrPullRequest,
  EnhancementCache,
  GitHubIssue,
  GitHubIssueOrPullRequest,
  GitHubIssueOrPullRequestSubjectType,
  GitHubPullRequest,
  GitHubStateType,
  IssueOrPullRequestColumnSubscription,
  IssueOrPullRequestPayloadEnhancement,
} from '../../types'
import { constants } from '../../utils'
import {
  filterRecordHasAnyForcedValue,
  getOwnerAndRepoFormattedFilter,
  itemPassesFilterRecord,
} from '../filters'
import { getSearchQueryTerms } from '../shared'
import {
  getIssueIconAndColor,
  getOwnerAndRepo,
  getPullRequestIconAndColor,
  isPullRequest,
} from './shared'
import { getRepoFullNameFromUrl } from './url'

export const issueOrPullRequestSubjectTypes: GitHubIssueOrPullRequestSubjectType[] = [
  'Issue',
  'PullRequest',
]

export function getIssueOrPullRequestIconAndColor(
  type: GitHubIssueOrPullRequestSubjectType,
  issueOrPullRequest: GitHubIssueOrPullRequest,
) {
  return type === 'PullRequest'
    ? getPullRequestIconAndColor(issueOrPullRequest as GitHubPullRequest)
    : getIssueIconAndColor(issueOrPullRequest as GitHubIssue)
}

export function mergeIssuesOrPullRequestsPreservingEnhancement(
  newItems: EnhancedGitHubIssueOrPullRequest[],
  prevItems: EnhancedGitHubIssueOrPullRequest[],
  { dropPrevItems }: { dropPrevItems?: boolean } = {},
) {
  const allItems = dropPrevItems
    ? newItems || []
    : _.concat(newItems || [], prevItems || [])

  return sortIssuesOrPullRequests(
    _.uniqBy(allItems, 'id').map(item => {
      const newItem = (newItems || []).find(i => i.id === item.id)
      const existingItem = prevItems.find(i => i.id === item.id)

      return mergeIssueOrPullRequestPreservingEnhancement(
        newItem!,
        existingItem,
      ) as any
    }),
  )
}

export function mergeIssueOrPullRequestPreservingEnhancement(
  newItem: EnhancedGitHubIssueOrPullRequest,
  existingItem: EnhancedGitHubIssueOrPullRequest | undefined,
) {
  if (!(newItem && existingItem)) return newItem || existingItem

  delete newItem.last_read_at
  delete newItem.last_unread_at

  const enhancements: Record<
    keyof Omit<
      EnhancedGitHubIssueOrPullRequest,
      keyof GitHubIssueOrPullRequest
    >,
    any
  > = {
    enhanced: existingItem.enhanced,
    forceUnreadLocally: existingItem.forceUnreadLocally,
    last_read_at: _.max([existingItem.last_read_at, newItem.last_read_at]),
    last_unread_at: _.max([
      existingItem.last_unread_at,
      newItem.last_unread_at,
    ]),
    merged: existingItem.merged,
    saved: existingItem.saved,
    unread: existingItem.unread,
  }

  return immer(newItem, draft => {
    Object.entries(enhancements).forEach(([key, value]) => {
      if (typeof value === 'undefined') return
      if (value === (draft as any)[key]) return
      if (typeof (draft as any)[key] !== 'undefined') return
      ;(draft as any)[key] = value
    })

    draft.updated_at = _.max([existingItem.updated_at, newItem.updated_at])!
  })
}

export function getIssueOrPullRequestState(
  item: GitHubIssueOrPullRequest | undefined,
): GitHubStateType | null {
  if (!item) return null

  const isPR = isPullRequest(item)

  if (
    (isPR && ('merged' in item && item.merged)) ||
    ('merged_at' in item && item.merged_at)
  )
    return 'merged'

  return item.state || null
}

export function getIssueOrPullRequestSubjectType(
  item: GitHubIssueOrPullRequest,
): GitHubIssueOrPullRequestSubjectType | null {
  if (!item) return null

  if ((item as any).pull_request) return 'PullRequest'
  if (item.html_url && item.html_url.includes('/pull/')) return 'PullRequest'
  if (item.url && item.url.includes('/pulls/')) return 'PullRequest'

  if (item.html_url && item.html_url.includes('/issues/')) return 'Issue'
  if (item.url && item.url.includes('/issues/')) return 'Issue'

  return null
}

export function getOlderIssueOrPullRequestDate(
  events: EnhancedGitHubIssueOrPullRequest[],
  field: keyof EnhancedGitHubIssueOrPullRequest = 'updated_at',
) {
  const olderItem = sortIssuesOrPullRequests(events, field, 'desc').slice(-1)[0]
  return olderItem && olderItem[field]
}

export function createIssuesOrPullRequestsCache(
  items: EnhancedGitHubIssueOrPullRequest[] | undefined,
  _cache?: EnhancementCache | undefined,
): EnhancementCache {
  const cache = _cache || new Map()

  if (!(items && items.length)) return cache

  const checkAndFix = (data: any, url: string, date: string) => {
    if (!cache.has(url)) {
      cache.set(url, { data, timestamp: new Date(date).valueOf() })
    }
  }

  items.forEach(item => {
    checkAndFix(item, item.url, item.updated_at)
  })

  return cache
}

export async function getIssueOrPullRequestsEnhancementMap(
  items: EnhancedGitHubIssueOrPullRequest[],
  {
    cache = new Map(),
    getGitHubInstallationTokenForRepo,
    githubOAuthToken,
  }: {
    cache: EnhancementCache | undefined | undefined
    getGitHubInstallationTokenForRepo: (
      owner: string | undefined,
      repo: string | undefined,
    ) => string | undefined
    githubOAuthToken: string
  },
): Promise<Record<string, IssueOrPullRequestPayloadEnhancement>> {
  const promises = items.map(async item => {
    const repoFullName = getRepoFullNameFromUrl(
      item && (item.repository_url || item.url),
    )
    const { owner, repo } = getOwnerAndRepo(repoFullName)
    if (!(owner && repo && item.number && item.url)) return

    const installationToken = getGitHubInstallationTokenForRepo(owner, repo)
    const githubToken = installationToken || githubOAuthToken

    const enhance: IssueOrPullRequestPayloadEnhancement = {}

    const mergeUrl = `${item.url.replace('/issues/', '/pulls/')}/merge`
    const hasMergedCache = cache.has(mergeUrl)
    const mergedCache = cache.get(mergeUrl)

    if (
      getIssueOrPullRequestSubjectType(item) === 'PullRequest' &&
      (!hasMergedCache ||
        (mergedCache &&
          item.updated_at &&
          new Date(item.updated_at).valueOf() > mergedCache.timestamp))
    ) {
      try {
        const { status } = await axios.get(
          `${mergeUrl}?access_token=${githubToken}`,
          {
            validateStatus: s => s === 204 || s === 404,
          },
        )

        enhance.merged = status === 204
        enhance.enhanced = true
        cache.set(mergeUrl, { data: enhance.merged, timestamp: Date.now() })
      } catch (error) {
        console.error(
          'Failed to load pull request merge status',
          mergeUrl,
          error,
        )
        cache.set(mergeUrl, false)
        if (!enhance.enhanced) enhance.enhanced = false
      }
    } else if (hasMergedCache) {
      if (mergedCache && typeof mergedCache.data === 'boolean') {
        enhance.merged = mergedCache.data
        enhance.enhanced = true
      } else if (!enhance.enhanced) enhance.enhanced = false
    }

    if (!Object.keys(enhance).length) return

    return { id: item.id, enhance }
  })

  const enhancements = await Promise.all(promises)

  const enhancementMap: any = enhancements.reduce(
    (map, payload) =>
      payload
        ? {
            ...map,
            [payload.id]: payload.enhance,
          }
        : map,
    {},
  )

  return enhancementMap
}

export function enhanceIssueOrPullRequests(
  items: Array<GitHubIssueOrPullRequest | EnhancedGitHubIssueOrPullRequest>,
  enhancementMap: Record<string, IssueOrPullRequestPayloadEnhancement>,
  currentEnhancedIssueOrPullRequests: EnhancedGitHubIssueOrPullRequest[] = [],
) {
  if (!(items && items.length)) return constants.EMPTY_ARRAY

  return items.map(item => {
    const enhanced = currentEnhancedIssueOrPullRequests.find(
      i => i.id === item.id,
    )

    const enhance = enhancementMap[item.id]
    if (!enhance) {
      if (!enhanced) return item
      return mergeIssueOrPullRequestPreservingEnhancement(item, enhanced)
    }

    return {
      ...mergeIssueOrPullRequestPreservingEnhancement(item, enhanced),
      ...enhance,
    } as EnhancedGitHubIssueOrPullRequest
  })
}

export function sortIssuesOrPullRequests(
  items: EnhancedGitHubIssueOrPullRequest[] | undefined,
  field: keyof EnhancedGitHubIssueOrPullRequest = 'updated_at',
  order: 'asc' | 'desc' = 'desc',
) {
  if (!(items && items.length)) return constants.EMPTY_ARRAY

  return _(items)
    .uniqBy('id')
    .orderBy(field, order)
    .value()
}

export function getGitHubIssueSearchQuery(
  params: IssueOrPullRequestColumnSubscription['params'],
  includeDefaultSorting: boolean = true,
) {
  const queries: string[] = []

  const { draft, involves, owners, state, subjectType, query } = params

  if (query) {
    const termsToSearchFor = getSearchQueryTerms(query)

    const convertedQuery = termsToSearchFor
      .map(termArr => {
        if (
          !(
            termArr &&
            Array.isArray(termArr) &&
            (termArr.length === 2 || termArr.length === 3)
          )
        )
          return ''

        const [key, value, isNegated] =
          termArr.length === 2 ? ['', termArr[0], termArr[1]] : termArr
        if (!(value && typeof value === 'string')) return false

        const searchTerm = key ? `${key}:${value}` : value

        return isNegated ? `NOT ${searchTerm}` : searchTerm
      })
      .filter(Boolean)
      .join(' ')

    queries.push(convertedQuery)
  }

  if (owners) {
    const { ownerFiltersWithRepos } = getOwnerAndRepoFormattedFilter({ owners })

    Object.entries(ownerFiltersWithRepos).forEach(([owner, ownerFilter]) => {
      if (!(owner && ownerFilter)) return

      const reposToPush: string[] = []
      Object.entries(ownerFilter.repos || {}).forEach(
        ([repo, repoFilterValue]) => {
          if (!(repo && repoFilterValue === true)) return

          const repoFullName = `${owner}/${repo}`.toLowerCase()
          reposToPush.push(repoFullName)
        },
      )

      if (ownerFilter.value === true && !reposToPush.length)
        queries.push(`user:${owner}`.toLowerCase())

      reposToPush.forEach(repoFullName => queries.push(`repo:${repoFullName}`))
    })
  }

  if (involves && filterRecordHasAnyForcedValue(involves)) {
    Object.entries(involves).forEach(([_user, value]) => {
      const user = `${_user || ''}`.trim().toLowerCase()
      if (!(user && typeof value === 'boolean')) return

      const negationSign = !value ? '-' : ''
      queries.push(`${negationSign}involves:${user}`)
    })
  }

  if (subjectType === 'Issue') queries.push('is:issue')
  else if (subjectType === 'PullRequest') queries.push('is:pr')

  if (typeof draft === 'boolean') {
    if (draft) queries.push('is:draft')
    else queries.push('-is:draft')
  }

  if (state && filterRecordHasAnyForcedValue(state)) {
    const open = itemPassesFilterRecord(state, 'open', true) ? 'open' : ''
    const closed = itemPassesFilterRecord(state, 'closed', true) ? 'closed' : ''
    const merged = itemPassesFilterRecord(state, 'merged', true) ? 'merged' : ''
    const includesExactly = [open, closed, merged].filter(Boolean).join(',')

    switch (includesExactly) {
      // 001
      case 'merged': {
        queries.push('is:merged')
        break
      }

      // 010
      case 'closed': {
        queries.push('state:closed')
        break
      }

      // 011
      case 'closed,merged': {
        queries.push('-state:open')
        break
      }

      // 100
      case 'open': {
        queries.push('state:open')
        break
      }

      // 101 (NOT POSSIBLE ON GITHUB)
      // case 'open,merged': {
      //   queries.push('is:merged')
      //   break
      // }

      // 110 (NOT POSSIBLE ON GITHUB)
      // case 'open,closed': {
      //   queries.push('is:unmerged')
      //   break
      // }

      // 000 (not valid)
      // 111 (return all)
      default: {
        break
      }
    }
  }

  if (includeDefaultSorting) {
    const searchTerms = getSearchQueryTerms(query)
    if (
      !searchTerms.find(
        searchTerm =>
          searchTerm &&
          Array.isArray(searchTerm) &&
          searchTerm.length === 3 &&
          searchTerm[0] === 'sort',
      )
    ) {
      queries.join('sort:updated-desc')
    }
  }

  return queries.join(' ')
}
