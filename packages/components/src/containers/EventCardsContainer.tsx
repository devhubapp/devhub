import {
  ActivityColumnSubscription,
  EnhancedGitHubEvent,
  getDefaultPaginationPerPage,
  getOlderEventDate,
  getSubscriptionOwnerOrOrg,
} from '@devhub/core'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'

import { CardsSearchHeader } from '../components/cards/CardsSearchHeader'
import { EmptyCards } from '../components/cards/EmptyCards'
import { EventCards, EventCardsProps } from '../components/cards/EventCards'
import { GenericMessageWithButtonView } from '../components/cards/GenericMessageWithButtonView'
import { NoTokenView } from '../components/cards/NoTokenView'
import { ButtonLink } from '../components/common/ButtonLink'
import { useColumn } from '../hooks/use-column'
import { useColumnData } from '../hooks/use-column-data'
import { useGitHubAPI } from '../hooks/use-github-api'
import { useReduxState } from '../hooks/use-redux-state'
import { octokit } from '../libs/github'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { sharedStyles } from '../styles/shared'
import { contentPadding } from '../styles/variables'
import { getGitHubAppInstallUri } from '../utils/helpers/shared'

export interface EventCardsContainerProps
  extends Omit<
    EventCardsProps,
    | 'column'
    | 'errorMessage'
    | 'fetchNextPage'
    | 'getItemByNodeIdOrId'
    | 'isShowingOnlyBookmarks'
    | 'itemNodeIdOrIds'
    | 'lastFetchedSuccessfullyAt'
    | 'refresh'
  > {
  columnId: string
}

export const EventCardsContainer = React.memo(
  (props: EventCardsContainerProps) => {
    const { columnId, ...otherProps } = props

    const appToken = useReduxState(selectors.appTokenSelector)
    const githubAppToken = useReduxState(selectors.githubAppTokenSelector)
    const githubOAuthToken = useReduxState(selectors.githubOAuthTokenSelector)
    const { column } = useColumn(columnId)

    // TODO: Support multiple subscriptions per column.
    const mainSubscription = useReduxState(
      useCallback(
        state => selectors.columnSubscriptionSelector(state, columnId),
        [columnId],
      ),
    ) as ActivityColumnSubscription | undefined

    const data = (mainSubscription && mainSubscription.data) || {}

    const _errorMessage = (data.errorMessage || '').toLowerCase()
    const maybePrivate =
      _errorMessage.includes('not found') ||
      _errorMessage.includes('not exist') ||
      _errorMessage.includes('permission')

    const subscriptionOwnerOrOrg = getSubscriptionOwnerOrOrg(mainSubscription)

    const ownerResponse = useGitHubAPI(
      octokit.users.getByUsername,
      maybePrivate && subscriptionOwnerOrOrg
        ? { username: subscriptionOwnerOrOrg }
        : null,
    )

    const dispatch = useDispatch()
    const installationsLoadState = useReduxState(
      selectors.installationsLoadStateSelector,
    )

    const { allItems, filteredItemsIds, getItemByNodeIdOrId } = useColumnData<
      EnhancedGitHubEvent
    >(columnId, { mergeSimilar: false })

    const clearedAt = column && column.filters && column.filters.clearedAt
    const olderDate = getOlderEventDate(allItems)

    const canFetchMore =
      clearedAt && (!olderDate || (olderDate && clearedAt >= olderDate))
        ? false
        : !!data.canFetchMore

    const fetchData = useCallback(
      ({ page }: { page?: number } = {}) => {
        dispatch(
          actions.fetchColumnSubscriptionRequest({
            columnId,
            params: {
              page: page || 1,
              perPage: getDefaultPaginationPerPage('activity'),
            },
            replaceAllItems: false,
          }),
        )
      },
      [columnId],
    )

    const fetchNextPage = useCallback(() => {
      const size = allItems.length

      const perPage = getDefaultPaginationPerPage('activity')
      const currentPage = Math.ceil(size / perPage)

      const nextPage = (currentPage || 0) + 1
      fetchData({ page: nextPage })
    }, [fetchData, allItems.length])

    const refresh = useCallback(() => {
      if (data.errorMessage === 'Bad credentials' && appToken) {
        dispatch(
          actions.refreshInstallationsRequest({
            includeInstallationToken: true,
          }),
        )
      } else {
        fetchData()
      }
    }, [
      fetchData,
      mainSubscription &&
        mainSubscription.data &&
        mainSubscription.data.errorMessage,
      ownerResponse && ownerResponse.data && ownerResponse.data.id,
      appToken,
    ])

    if (!mainSubscription) return null

    if (!(appToken && githubOAuthToken)) {
      return <NoTokenView githubAppType={githubAppToken ? 'oauth' : 'both'} />
    }

    if (maybePrivate) {
      if (!githubAppToken) return <NoTokenView githubAppType="app" />

      if (ownerResponse.loadingState === 'loading') {
        return (
          <EmptyCards
            columnId={columnId}
            fetchNextPage={undefined}
            loadState="loading"
            refresh={undefined}
          />
        )
      }

      if (ownerResponse.data && ownerResponse.data.id) {
        return (
          <View style={sharedStyles.flex}>
            <CardsSearchHeader
              key={`cards-search-header-column-${columnId}`}
              columnId={columnId}
            />

            <View
              style={[
                sharedStyles.flex,
                sharedStyles.center,
                sharedStyles.padding,
              ]}
            >
              <GenericMessageWithButtonView
                buttonView={
                  <ButtonLink
                    analyticsLabel="setup_github_app_from_column"
                    children="Install GitHub App"
                    disabled={
                      mainSubscription.data.loadState === 'loading' ||
                      mainSubscription.data.loadState === 'loading_first'
                    }
                    href={getGitHubAppInstallUri({
                      suggestedTargetId: ownerResponse.data.id,
                    })}
                    loading={
                      installationsLoadState === 'loading' ||
                      mainSubscription.data.loadState === 'loading' ||
                      mainSubscription.data.loadState === 'loading_first'
                    }
                    openOnNewTab={false}
                  />
                }
                emoji="lock"
                subtitle="Install the GitHub App to unlock private access. No code permission required."
                title="Private repository?"
              />
            </View>
          </View>
        )
      }
    }

    if (!column) return null

    return (
      <EventCards
        {...otherProps}
        key={`event-cards-${columnId}`}
        columnId={columnId}
        errorMessage={mainSubscription.data.errorMessage || ''}
        fetchNextPage={canFetchMore ? fetchNextPage : undefined}
        getItemByNodeIdOrId={getItemByNodeIdOrId}
        isShowingOnlyBookmarks={!!(column.filters && column.filters.saved)}
        itemNodeIdOrIds={filteredItemsIds}
        lastFetchedSuccessfullyAt={
          mainSubscription.data.lastFetchedSuccessfullyAt
        }
        refresh={refresh}
      />
    )
  },
)

EventCardsContainer.displayName = 'EventCardsContainer'
