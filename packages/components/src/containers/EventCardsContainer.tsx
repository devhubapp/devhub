import React, { useCallback, useEffect, useRef } from 'react'

import {
  ActivityColumnSubscription,
  Column,
  ColumnSubscription,
  constants,
  EnhancedGitHubEvent,
  getOlderEventDate,
  Omit,
} from '@devhub/core'
import { View } from 'react-native'
import { EmptyCards } from '../components/cards/EmptyCards'
import { EventCards, EventCardsProps } from '../components/cards/EventCards'
import { GenericMessageWithButtonView } from '../components/cards/GenericMessageWithButtonView'
import { NoTokenView } from '../components/cards/NoTokenView'
import { ButtonLink } from '../components/common/ButtonLink'
import { useAppViewMode } from '../hooks/use-app-view-mode'
import { useGitHubAPI } from '../hooks/use-github-api'
import { useReduxAction } from '../hooks/use-redux-action'
import { useReduxState } from '../hooks/use-redux-state'
import { octokit } from '../libs/github'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { contentPadding } from '../styles/variables'
import { getGitHubAppInstallUri } from '../utils/helpers/shared'

export type EventCardsContainerProps = Omit<
  EventCardsProps,
  | 'cardViewMode'
  | 'errorMessage'
  | 'events'
  | 'fetchNextPage'
  | 'lastFetchedAt'
  | 'loadState'
  | 'refresh'
> & {
  column: Column
  subscriptions: ColumnSubscription[]
}

export const EventCardsContainer = React.memo(
  (props: EventCardsContainerProps) => {
    const { column } = props

    const { cardViewMode } = useAppViewMode()

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

    const isNotFound = (data.errorMessage || '')
      .toLowerCase()
      .includes('not found')

    const subscriptionOwnerOrOrg =
      (firstSubscription &&
        firstSubscription.params &&
        (('owner' in firstSubscription.params &&
          firstSubscription.params.owner) ||
          ('org' in firstSubscription.params &&
            firstSubscription.params.org))) ||
      undefined

    const ownerResponse = useGitHubAPI(
      octokit.users.getByUsername,
      isNotFound && subscriptionOwnerOrOrg
        ? { username: subscriptionOwnerOrOrg }
        : null,
    )

    const username = useReduxState(selectors.currentGitHubUsernameSelector)

    const installationsLoadState = useReduxState(
      selectors.installationsLoadStateSelector,
    )

    const installationOwnerNames = useReduxState(
      selectors.installationOwnerNamesSelector,
    )

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

    useEffect(() => {
      canFetchMoreRef.current = (() => {
        const clearedAt = column.filters && column.filters.clearedAt
        const olderDate = getOlderEventDate(allItems)

        if (clearedAt && (!olderDate || (olderDate && clearedAt >= olderDate)))
          return false
        return !!data.canFetchMore
      })()
    }, [allItems, column.filters, data.canFetchMore])

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

    const fetchNextPage = useCallback(() => {
      const size = allItems.length

      const perPage = constants.DEFAULT_PAGINATION_PER_PAGE
      const currentPage = Math.ceil(size / perPage)

      const nextPage = (currentPage || 0) + 1
      fetchData({ page: nextPage })
    }, [fetchData, allItems.length])

    const refresh = useCallback(() => {
      fetchData()
    }, [fetchData])

    if (!firstSubscription) return null

    if (!(appToken && githubOAuthToken)) {
      return <NoTokenView githubAppType={githubAppToken ? 'oauth' : 'both'} />
    }

    if (isNotFound) {
      if (!githubAppToken) return <NoTokenView githubAppType="app" />

      if (ownerResponse.loadingState === 'loading') {
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

      if (ownerResponse.data && ownerResponse.data.id) {
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
                <ButtonLink
                  analyticsLabel="setup_github_app_from_column"
                  children="Install GitHub App"
                  disabled={
                    firstSubscription.data.loadState === 'loading' ||
                    firstSubscription.data.loadState === 'loading_first'
                  }
                  href={getGitHubAppInstallUri({
                    suggestedTargetId: ownerResponse.data.id,
                  })}
                  loading={
                    installationsLoadState === 'loading' ||
                    firstSubscription.data.loadState === 'loading' ||
                    firstSubscription.data.loadState === 'loading_first'
                  }
                  openOnNewTab={false}
                />
              }
              emoji="lock"
              subtitle="Install the GitHub App to unlock private access. No code permission required."
              title="Private repository?"
            />
          </View>
        )
      }
    }

    if (
      username &&
      `${subscriptionOwnerOrOrg || ''}`.toLowerCase() ===
        `${username || ''}`.toLowerCase() &&
      !(installationOwnerNames && installationOwnerNames.length)
    ) {
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
              <ButtonLink
                analyticsLabel="setup_github_app_from_user_repo_column"
                children="Install GitHub App"
                disabled={
                  firstSubscription.data.loadState === 'loading' ||
                  firstSubscription.data.loadState === 'loading_first'
                }
                href={getGitHubAppInstallUri()}
                loading={
                  installationsLoadState === 'loading' ||
                  firstSubscription.data.loadState === 'loading' ||
                  firstSubscription.data.loadState === 'loading_first'
                }
                openOnNewTab={false}
              />
            }
            emoji="sunny"
            subtitle="Please install the GitHub App to continue. No code permission required."
            title="Not installed"
          />
        </View>
      )
    }

    return (
      <EventCards
        {...props}
        key={`event-cards-${column.id}`}
        cardViewMode={cardViewMode}
        errorMessage={firstSubscription.data.errorMessage || ''}
        fetchNextPage={canFetchMoreRef.current ? fetchNextPage : undefined}
        lastFetchedAt={firstSubscription.data.lastFetchedAt}
        loadState={
          installationsLoadState === 'loading' && !filteredItems.length
            ? 'loading_first'
            : firstSubscription.data.loadState || 'not_loaded'
        }
        events={filteredItems}
        refresh={refresh}
      />
    )
  },
)
