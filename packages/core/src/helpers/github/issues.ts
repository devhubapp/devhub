import axios from 'axios'
import _ from 'lodash'

import {
  EnhancedGitHubIssueOrPullRequest,
  EnhancementCache,
  GitHubIssueOrPullRequest,
  GitHubIssueOrPullRequestSubjectType,
  IssueOrPullRequestPayloadEnhancement,
} from '../../types'
import { getOwnerAndRepo } from './shared'
import { getRepoFullNameFromUrl } from './url'

export function getIssueOrPullRequestSubjectType(
  item: GitHubIssueOrPullRequest,
): GitHubIssueOrPullRequestSubjectType | null {
  if (!item) return null

  if ((item as any).pull_request) return 'PullRequest'
  if (item.html_url && item.html_url.includes('/pull/')) return 'PullRequest'
  if (item.url && item.url.includes('/pulls/')) return 'PullRequest'

  return 'Issue'
}

export function getOlderIssueOrPullRequestDate(
  events: EnhancedGitHubIssueOrPullRequest[],
  field: keyof EnhancedGitHubIssueOrPullRequest = 'updated_at',
) {
  const olderItem = sortIssuesOrPullRequests(events, field, 'desc').pop()
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
  return items.map(item => {
    const enhanced = currentEnhancedIssueOrPullRequests.find(
      i => i.id === item.id,
    )

    const enhance = enhancementMap[item.id]
    if (!enhance) {
      if (!enhanced) return item
      return { ...enhanced, ...item }
    }

    return {
      ..._.pick(enhanced, ['merged']),
      ...item,
      ...enhance,
    } as EnhancedGitHubIssueOrPullRequest
  })
}

export function sortIssuesOrPullRequests(
  events: EnhancedGitHubIssueOrPullRequest[] | undefined,
  field: keyof EnhancedGitHubIssueOrPullRequest = 'updated_at',
  order: 'asc' | 'desc' = 'desc',
) {
  if (!events) return []
  return _(events)
    .uniqBy('id')
    .orderBy(field, order)
    .value()
}
