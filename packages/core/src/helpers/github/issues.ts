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
  UserPlan,
} from '../../types'
import { constants } from '../../utils'
import {
  filterRecordHasAnyForcedValue,
  itemPassesFilterRecord,
} from '../filters'
import { getSearchQueryTerms, isIssueOrPullRequestPrivate } from '../shared'
import {
  getIssueIconAndColor,
  getOwnerAndRepo,
  getPullRequestIconAndColor,
  isItemRead,
  isPullRequest,
} from './shared'
import {
  getBaseAPIUrlFromOtherAPIUrl,
  getRepoFullNameFromUrl,
  getRepoUrlFromOtherUrl,
} from './url'

export const issueOrPullRequestSubjectTypes: GitHubIssueOrPullRequestSubjectType[] = [
  'Issue',
  'PullRequest',
]

function _getIssueOrPullRequestIconAndColor(
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
    last_read_at: _.max([existingItem.last_read_at, newItem.last_read_at]),
    last_saved_at: _.max([existingItem.last_saved_at, newItem.last_saved_at]),
    last_unread_at: _.max([
      existingItem.last_unread_at,
      newItem.last_unread_at,
    ]),
    last_unsaved_at: _.max([
      existingItem.last_unsaved_at,
      newItem.last_unsaved_at,
    ]),
    merged: existingItem.merged,
    private: existingItem.private,
  }

  return immer(newItem, draft => {
    Object.entries(enhancements).forEach(([key, value]) => {
      if (typeof value === 'undefined') return
      if (value === (draft as any)[key])
        return // if (typeof (draft as any)[key] !== 'undefined') return
      ;(draft as any)[key] = value
    })

    draft.updated_at = _.max([existingItem.updated_at, newItem.updated_at])!
  })
}

export function getIssueOrPullRequestState(
  item:
    | {
        state?: GitHubIssueOrPullRequest['state']
        pull_request?: object
        merged?: GitHubPullRequest['merged']
        merged_at?: GitHubPullRequest['merged_at']
        html_url?: GitHubPullRequest['html_url']
        url?: GitHubPullRequest['url']
      }
    | undefined,
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
  items: EnhancedGitHubIssueOrPullRequest[],
  field: 'created_at' | 'updated_at' = 'updated_at',
  ignoreFutureDates = true,
) {
  const now = Date.now()
  return sortIssuesOrPullRequests(items, field, 'asc')
    .map(item => item[field])
    .filter(
      date =>
        !!(date && ignoreFutureDates ? now > new Date(date).getTime() : true),
    )[0]
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
  const repoMetas = _.uniqBy(
    items
      .map(item => {
        const repoURL = getRepoUrlFromOtherUrl(
          item && (item.repository_url || item.url),
        )

        const { owner, repo } = getOwnerAndRepo(
          getRepoFullNameFromUrl(repoURL || ''),
        )

        let repoAPIURL = getBaseAPIUrlFromOtherAPIUrl(item && item.url)
        if (repoAPIURL && owner && repo)
          repoAPIURL = `${repoAPIURL}/repos/${owner}/${repo}`

        return { repoURL, repoAPIURL, owner, repo }
      })
      .filter(
        meta =>
          !!(
            meta &&
            meta.owner &&
            meta.repo &&
            meta.repoAPIURL &&
            meta.repoURL
          ),
      ),
    'repoAPIURL',
  )

  const repoPromises = repoMetas.map(
    async ({ repoURL, repoAPIURL, owner, repo }) => {
      const cacheValue = cache.get(repoURL!)
      if (cacheValue && Date.now() - cacheValue.timestamp < 1000 * 60 * 60)
        return cacheValue

      const installationToken = getGitHubInstallationTokenForRepo(owner, repo)
      const githubToken = installationToken || githubOAuthToken

      try {
        const { data } = await axios.get(
          `${repoAPIURL}?access_token=${githubToken}`,
        )
        cache.set(repoURL!, { data, timestamp: Date.now() })
      } catch (error) {
        console.error('Failed to load repository.', repoAPIURL, repoURL, error)
        cache.set(repoURL!, false)
      }
    },
  )

  await Promise.all(repoPromises)

  const promises = items.map(async item => {
    const repoURL = getRepoUrlFromOtherUrl(
      item && (item.repository_url || item.url),
    )!

    const repoFullName = getRepoFullNameFromUrl(repoURL)
    const { owner, repo } = getOwnerAndRepo(repoFullName)
    if (!(owner && repo && item.number && item.url)) return

    const installationToken = getGitHubInstallationTokenForRepo(owner, repo)
    const githubToken = installationToken || githubOAuthToken

    const enhance: IssueOrPullRequestPayloadEnhancement = {}

    const mergeUrl = `${item.url.replace('/issues/', '/pulls/')}/merge`
    const hasMergedCache = cache.has(mergeUrl)
    const mergedCache = cache.get(mergeUrl)

    const repoCacheValue = cache.get(repoURL)
    if (repoCacheValue && repoCacheValue.data) {
      enhance.private = repoCacheValue.data.private
    }

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
      .map(queryTerm => {
        if (
          !(
            queryTerm &&
            Array.isArray(queryTerm) &&
            (queryTerm.length === 2 || queryTerm.length === 3)
          )
        )
          return ''

        const [key, value, isNegated] =
          queryTerm.length === 2 ? ['', queryTerm[0], queryTerm[1]] : queryTerm
        if (!(value && typeof value === 'string')) return false

        const searchTerm = key
          ? `${key}:${value}`
          : value.match(/^#([0-9]+)$/) && value.match(/^#([0-9]+)$/)![1]
          ? value.match(/^#([0-9]+)$/)![1]!
          : value

        return isNegated ? `NOT ${searchTerm}` : searchTerm
      })
      .filter(Boolean)
      .join(' ')

    queries.push(convertedQuery)
  }

  if (owners) {
    Object.entries(owners || {}).forEach(([owner, ownerFilter]) => {
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
      queries.push('sort:updated-desc')
    }
  }

  return queries.join(' ')
}

export function getGitHubIssueOrPullRequestSubItems(
  issueOrPullRequest: EnhancedGitHubIssueOrPullRequest,
  { plan }: { plan: UserPlan | null | undefined },
) {
  const repoURL = getRepoUrlFromOtherUrl(
    issueOrPullRequest.repository_url ||
      issueOrPullRequest.url ||
      issueOrPullRequest.html_url,
  )

  const repoFullName = repoURL && getRepoFullNameFromUrl(repoURL)
  const { owner: repoOwnerName, repo: repoName } = getOwnerAndRepo(
    repoFullName || '',
  )

  const iconDetails = _getIssueOrPullRequestIconAndColor(
    getIssueOrPullRequestSubjectType(issueOrPullRequest) || 'Issue',
    issueOrPullRequest,
  )

  const isRead = isItemRead(issueOrPullRequest)
  const isPrivate = isIssueOrPullRequestPrivate(issueOrPullRequest)

  const canSee =
    !isPrivate ||
    !!(
      plan &&
      (plan.status === 'active' || plan.status === 'trialing') &&
      plan.featureFlags.enablePrivateRepositories
    )

  return {
    canSee,
    iconDetails,
    isPrivate,
    isRead,
    repoFullName,
    repoName,
    repoOwnerName,
    repoURL,
  }
}
