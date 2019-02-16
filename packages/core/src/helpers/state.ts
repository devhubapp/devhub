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

    byId[id] = {
      ...column,
      id,
      subscriptionIds: column.subscriptionIds || [],
      createdAt: column.createdAt || new Date().toISOString(),
      updatedAt: column.updatedAt || new Date().toISOString(),
    }

    return id
  })

  return { allIds, byId, updatedAt: updatedAt || new Date().toISOString() }
}

export function normalizeSubscriptions(
  subscriptions: ColumnSubscriptionCreation[],
  updatedAt?: string,
) {
  const items = subscriptions || []
  const byId: Record<string, ColumnSubscription | undefined> = {}
  const allIds = items.map((subscription: ColumnSubscriptionCreation) => {
    const id = subscription.id || getUniqueIdForSubscription(subscription)
    byId[id] = {
      ...subscription,
      id,
      data: subscription.data || {},
      createdAt: subscription.createdAt || new Date().toISOString(),
      updatedAt: subscription.updatedAt || new Date().toISOString(),
    } as ColumnSubscription

    return id
  })

  return { allIds, byId, updatedAt: updatedAt || new Date().toISOString() }
}

export function normalizeInstallations(
  installations: Installation[],
): NormalizedInstallations {
  const items = installations || []

  const allIds: number[] = []
  const allOwnerNames: string[] = []
  // const allRepoFullNames: string[] = []
  const byId: Record<number, Installation | undefined> = {}
  const byOwnerName: Record<string, number> = {}
  // const byRepoFullName: Record<string, number> = {}

  items.forEach(installation => {
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
