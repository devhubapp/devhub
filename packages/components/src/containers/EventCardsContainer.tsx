import React, { useCallback, useEffect, useRef, useState } from 'react'

import {
  ActivityColumnSubscription,
  Column,
  ColumnSubscription,
  constants,
  EnhancedGitHubEvent,
  getOlderEventDate,
  InstallationResponse,
  Omit,
} from '@devhub/core'
import { View } from 'react-native'
import { EmptyCards } from '../components/cards/EmptyCards'
import { EventCards, EventCardsProps } from '../components/cards/EventCards'
import { GenericMessageWithButtonView } from '../components/cards/GenericMessageWithButtonView'
import { NoTokenView } from '../components/cards/NoTokenView'
import { Button } from '../components/common/Button'
import { Link } from '../components/common/Link'
import { useReduxAction } from '../hooks/use-redux-action'
import { useReduxState } from '../hooks/use-redux-state'
import { octokit } from '../libs/github'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { contentPadding } from '../styles/variables'

export type EventCardsContainerProps = Omit<
  EventCardsProps,
  'errorMessage' | 'events' | 'fetchNextPage' | 'loadState' | 'refresh'
> & {
  column: Column
  subscriptions: ColumnSubscription[]
}

export const EventCardsContainer = React.memo(
  (props: EventCardsContainerProps) => {
    const { column } = props

    const appToken = useReduxState(selectors.appTokenSelector)
    const githubAppToken = useReduxState(selectors.githubAppTokenSelector)
    const githubOAuthToken = useReduxState(selectors.githubOAuthTokenSelector)

    // TODO: Support multiple subscriptions per column.
    const firstSubscription = useReduxState(
      state =>
        selectors.subscriptionSelector(state, column.subscriptionIds[0]) as
          | ActivityColumnSubscription
          | undefined,
    )

    const data = (firstSubscription && firstSubscription.data) || {}

    const owner =
      (firstSubscription &&
        (('owner' in firstSubscription.params &&
          firstSubscription.params.owner) ||
          ('org' in firstSubscription.params &&
            firstSubscription.params.org))) ||
      undefined
    const repo =
      (firstSubscription &&
        ('repo' in firstSubscription.params &&
          firstSubscription.params.repo)) ||
      undefined

    // TODO: Get from redux state
    const installationResponse = { owner, repo } as any

    const fetchColumnSubscriptionRequest = useReduxAction(
      actions.fetchColumnSubscriptionRequest,
    )

    const subscriptionsDataSelectorRef = useRef(
      selectors.createSubscriptionsDataSelector(),
    )

    const filteredSubscriptionsDataSelectorRef = useRef(
      selectors.createFilteredSubscriptionsDataSelector(),
    )

    useEffect(() => {
      subscriptionsDataSelectorRef.current = selectors.createSubscriptionsDataSelector()
      filteredSubscriptionsDataSelectorRef.current = selectors.createFilteredSubscriptionsDataSelector()
    }, column.subscriptionIds)

    const allItems = useReduxState(
      useCallback(
        state => {
          return subscriptionsDataSelectorRef.current(
            state,
            column.subscriptionIds,
          )
        },
        [column.subscriptionIds, column.filters],
      ),
    ) as EnhancedGitHubEvent[]

    const filteredItems = useReduxState(
      useCallback(
        state => {
          return filteredSubscriptionsDataSelectorRef.current(
            state,
            column.subscriptionIds,
            column.filters,
          )
        },
        [column.subscriptionIds, column.filters],
      ),
    ) as EnhancedGitHubEvent[]

    const canFetchMoreRef = useRef(false)

    useEffect(
      () => {
        canFetchMoreRef.current = (() => {
          const clearedAt = column.filters && column.filters.clearedAt
          const olderDate = getOlderEventDate(allItems)

          if (
            clearedAt &&
            (!olderDate || (olderDate && clearedAt >= olderDate))
          )
            return false
          return !!data.canFetchMore
        })()
      },
      [allItems, column.filters, data.canFetchMore],
    )

    const fetchData = useCallback(
      ({ page }: { page?: number } = {}) => {
        fetchColumnSubscriptionRequest({
          columnId: column.id,
          params: {
            page: page || 1,
            perPage: constants.DEFAULT_PAGINATION_PER_PAGE,
          },
        })
      },
      [fetchColumnSubscriptionRequest, column.id],
    )

    const fetchNextPage = useCallback(
      () => {
        const size = allItems.length

        const perPage = constants.DEFAULT_PAGINATION_PER_PAGE
        const currentPage = Math.ceil(size / perPage)

        const nextPage = (currentPage || 0) + 1
        fetchData({ page: nextPage })
      },
      [fetchData, allItems.length],
    )

    const refresh = useCallback(
      () => {
        fetchData()
      },
      [fetchData],
    )

    if (!firstSubscription) return null

    if (!(appToken && githubOAuthToken)) {
      return <NoTokenView githubAppType={githubAppToken ? 'oauth' : 'both'} />
    }

    if (
      (firstSubscription.data.errorMessage || '')
        .toLowerCase()
        .includes('not found')
    ) {
      if (!githubAppToken) return <NoTokenView githubAppType="app" />

      if (installationResponse.ownerId) {
        return (
          <View
            style={{
              flex: 1,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              padding: contentPadding,
            }}
          >
            <GenericMessageWithButtonView
              buttonView={
                <Link
                  analyticsLabel="setup_github_app"
                  href={
                    installationResponse.ownerId
                      ? `https://github.com/apps/${
                          constants.GITHUB_APP_CANNONICAL_ID
                        }/installations/new/permissions?suggested_target_id=${
                          installationResponse.ownerId
                        }${
                          installationResponse.repoId
                            ? `&repository_ids[]=${installationResponse.repoId}`
                            : ``
                        }`
                      : `https://github.com/apps/${
                          constants.GITHUB_APP_CANNONICAL_ID
                        }/installations/new`
                  }
                >
                  <Button
                    children="Install GitHub App"
                    disabled={installationResponse.isLoading}
                    loading={installationResponse.isLoading}
                    onPress={undefined}
                  />
                </Link>
              }
              emoji="lock"
              subtitle="Install the GitHub App to get private access. No code permission required."
              title="Private repository?"
            />
          </View>
        )
      }

      if (installationResponse.isLoading) {
        return (
          <EmptyCards
            clearedAt={undefined}
            columnId={column.id}
            fetchNextPage={undefined}
            loadState="loading"
            refresh={undefined}
          />
        )
      }
    }

    return (
      <EventCards
        {...props}
        key={`event-cards-${column.id}`}
        errorMessage={firstSubscription.data.errorMessage || ''}
        fetchNextPage={canFetchMoreRef.current ? fetchNextPage : undefined}
        loadState={firstSubscription.data.loadState || 'not_loaded'}
        events={filteredItems}
        refresh={refresh}
      />
    )
  },
)
