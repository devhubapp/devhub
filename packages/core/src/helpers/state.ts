import immer from 'immer'
import _ from 'lodash'

import {
  Column,
  ColumnCreation,
  ColumnSubscription,
  ColumnSubscriptionCreation,
  Installation,
  NormalizedInstallations,
} from '../types'
import { getUniqueIdForSubscription } from './github/shared'
import { guid, normalizeUsername } from './shared'

export function normalizeColumns(
  columns: ColumnCreation[],
  updatedAt?: string,
) {
  const items = columns || []
  const byId: Record<string, Column | undefined> = {}

  const allIds = items.map((column: ColumnCreation) => {
    const id = column.id || guid()

    byId[id] = immer(column, (draft) => {
      draft.id = id
      draft.subscriptionIds = column.subscriptionIds || []
      draft.subscriptionIdsHistory = column.subscriptionIdsHistory || []
      draft.createdAt = column.createdAt || new Date().toISOString()
      draft.updatedAt = column.updatedAt || new Date().toISOString()

      draft.subscriptionIds.forEach((subscriptionId) => {
        if (!subscriptionId) return
        if (!draft.subscriptionIdsHistory.includes(subscriptionId)) {
          draft.subscriptionIdsHistory.push(subscriptionId)
        }
      })
    }) as Column

    return id
  })

  return { allIds, byId, updatedAt: updatedAt || new Date().toISOString() }
}

export function normalizeSubscriptions(
  subscriptions: ColumnSubscriptionCreation[],
  updatedAt?: string,
): {
  allIds: string[]
  byId: Record<string, ColumnSubscription | undefined>
  updatedAt: string
} {
  const items = subscriptions || []
  const byId: Record<string, ColumnSubscription | undefined> = {}
  const allIds = items.map((subscription: ColumnSubscriptionCreation) => {
    const id = subscription.id || getUniqueIdForSubscription(subscription)
    byId[id] = immer(subscription as ColumnSubscription, (draft) => {
      draft.id = id
      draft.data = subscription.data || {}
      draft.createdAt = subscription.createdAt || new Date().toISOString()
      draft.updatedAt = subscription.updatedAt || new Date().toISOString()
    })

    return id
  })

  return { allIds, byId, updatedAt: updatedAt || new Date().toISOString() }
}

export function normalizeInstallations(
  installations: Installation[],
): NormalizedInstallations {
  const items = _.orderBy((installations || []).filter(Boolean), [
    'account.login',
    'asc',
  ]) as Installation[]

  const allIds: number[] = []
  const allOwnerNames: string[] = []
  // const allRepoFullNames: string[] = []
  const byId: Record<number, Installation | undefined> = {}
  const byOwnerName: Record<string, number> = {}
  // const byRepoFullName: Record<string, number> = {}

  items.forEach((installation) => {
    if (!(installation && installation.id)) return

    allIds.push(installation.id)
    byId[installation.id] = installation

    const ownerName = normalizeUsername(
      (installation.account && installation.account.login) || undefined,
    )
    if (ownerName) {
      allOwnerNames.push(ownerName)
      byOwnerName[ownerName] = installation.id
    }

    /*
    const repos = installation.repositories

    if (repos) {
      repos.forEach(repo => {
        if (!(repo && repo.repoName)) return

        const _ownerName = normalizeUsername(repo.ownerName || undefined)
        if (_ownerName) {
          allOwnerNames.push(_ownerName)
          byOwnerName[_ownerName] = installation.id!
        }

        const repoName = `${repo.repoName}`.trim().toLowerCase()
        if (repoName) {
          const repoFullName = `${_ownerName}/${repoName}`
          allRepoFullNames.push(repoFullName)
          byRepoFullName[repoFullName] = installation.id!
        }
      })
    }
    */
  })

  return {
    allIds: _.uniq(allIds),
    allOwnerNames: _.uniq(allOwnerNames),
    // allRepoFullNames: _.uniq(allRepoFullNames),
    byId,
    byOwnerName,
    // byRepoFullName,
  }
}
