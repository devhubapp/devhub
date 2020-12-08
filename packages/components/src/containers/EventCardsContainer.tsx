import {
  capitalizeFirstLetter,
  constants,
  EnhancedGitHubEvent,
  getDefaultPaginationPerPage,
  getOlderOrNewerItemDate,
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
import { Button } from '../components/common/Button'
import { ButtonLink } from '../components/common/ButtonLink'
import { Spacer } from '../components/common/Spacer'
import { useColumn } from '../hooks/use-column'
import { useColumnData } from '../hooks/use-column-data'
import { useGitHubAPI } from '../hooks/use-github-api'
import { useReduxState } from '../hooks/use-redux-state'
import { useLoginHelpers } from '../components/context/LoginHelpersContext'
import * as github from '../libs/github'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { sharedStyles } from '../styles/shared'
import { getGitHubAppInstallUri } from '../utils/helpers/shared'
import { contentPadding } from '../styles/variables'
import { QuickFeedbackRow } from '../components/common/QuickFeedbackRow'

export interface EventCardsContainerProps
  extends Omit<
    EventCardsProps,
    | 'column'
    | 'errorMessage'
    | 'fetchNextPage'
    | 'getItemByNodeIdOrId'
    | 'isShowingOnlyBookmarks'
    | 'itemNodeIdOrIds'
    | 'lastFetchSuccessAt'
    | 'refresh'
  > {
  columnId: string
}

export const EventCardsContainer = React.memo(
  (props: EventCardsContainerProps) => {
    const { columnId, ...otherProps } = props

    const {
      addPersonalAccessToken,
      isExecutingOAuth,
      isLoggingIn,
      patLoadingState,
    } = useLoginHelpers()

    const appToken = useReduxState(selectors.appTokenSelector)
    const githubAppToken = useReduxState(selectors.githubAppTokenSelector)
    const githubToken = useReduxState(selectors.githubTokenSelector)
    const { column, hasCrossedColumnsLimit } = useColumn(columnId)

    // TODO: Support multiple subscriptions per column.
    const mainSubscription = useReduxState(
      useCallback(
        (state) =>
          selectors.createColumnSubscriptionSelector()(state, columnId),
        [columnId],
      ),
    )
    const subscriptions = useReduxState(
      useCallback(
        (state) =>
          selectors.createColumnSubscriptionsSelector()(state, columnId),
        [columnId],
      ),
    )

    const data = mainSubscription && mainSubscription.data

    const _errorMessage = ((data && data.errorMessage) || '').toLowerCase()
    const maybePrivate =
      _errorMessage.includes('not found') ||
      _errorMessage.includes('not exist') ||
      _errorMessage.includes('permission')

    const subscriptionOwnerOrOrg = getSubscriptionOwnerOrOrg(mainSubscription)

    const ownerResponse = useGitHubAPI(
      github.getOctokitForToken(githubToken!).users.getByUsername,
      maybePrivate && subscriptionOwnerOrOrg
        ? { username: subscriptionOwnerOrOrg }
        : null,
    )

    const dispatch = useDispatch()
    const installationsLoadState = useReduxState(
      selectors.installationsLoadStateSelector,
    )

    const {
      allItems,
      filteredItemsIds,
      getItemByNodeIdOrId,
    } = useColumnData<EnhancedGitHubEvent>(columnId, { mergeSimilar: false })

    const clearedAt = column && column.filters && column.filters.clearedAt
    const olderDate = getOlderOrNewerItemDate('activity', 'older', allItems)

    const canFetchMore =
      clearedAt && (!olderDate || (olderDate && clearedAt >= olderDate))
        ? false
        : !!(data && data.canFetchMore)

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
      if (data && data.errorMessage === 'Bad credentials' && appToken) {
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

    const ENABLE_GITHUB_APP_SUPPORT =
      constants.ENABLE_GITHUB_APP_SUPPORT &&
      !subscriptions.find((s) => ['USER_ORG_EVENTS'].includes(s.subtype || ''))
    const ENABLE_GITHUB_PERSONAL_ACCESS_TOKEN_SUPPORT =
      constants.ENABLE_GITHUB_PERSONAL_ACCESS_TOKEN_SUPPORT

    if (!(appToken && githubToken)) {
      return <NoTokenView githubAppType={githubAppToken ? 'oauth' : 'both'} />
    }

    if (maybePrivate && !hasCrossedColumnsLimit) {
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
                { paddingBottom: contentPadding / 2 },
              ]}
            >
              <GenericMessageWithButtonView
                buttonView={
                  <>
                    {ENABLE_GITHUB_APP_SUPPORT && (
                      <ButtonLink
                        analyticsLabel="setup_github_app_from_column"
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
                      >
                        Install GitHub App
                      </ButtonLink>
                    )}

                    {ENABLE_GITHUB_APP_SUPPORT &&
                      ENABLE_GITHUB_PERSONAL_ACCESS_TOKEN_SUPPORT && (
                        <Spacer height={contentPadding / 2} />
                      )}

                    {ENABLE_GITHUB_PERSONAL_ACCESS_TOKEN_SUPPORT && (
                      <Button
                        analyticsLabel="setup_github_pat_from_column"
                        disabled={
                          mainSubscription.data.loadState === 'loading' ||
                          mainSubscription.data.loadState === 'loading_first'
                        }
                        loading={
                          installationsLoadState === 'loading' ||
                          mainSubscription.data.loadState === 'loading' ||
                          mainSubscription.data.loadState === 'loading_first' ||
                          patLoadingState === 'adding' ||
                          isLoggingIn ||
                          isExecutingOAuth
                        }
                        onPress={() => {
                          void addPersonalAccessToken()
                        }}
                      >
                        Add Personal Access Token
                      </Button>
                    )}
                  </>
                }
                emoji="lock"
                footer={<QuickFeedbackRow />}
                subtitle={
                  ENABLE_GITHUB_APP_SUPPORT ||
                  ENABLE_GITHUB_PERSONAL_ACCESS_TOKEN_SUPPORT
                    ? `${capitalizeFirstLetter(
                        [
                          ENABLE_GITHUB_APP_SUPPORT && 'install the GitHub App',
                          ENABLE_GITHUB_PERSONAL_ACCESS_TOKEN_SUPPORT &&
                            'add a Personal Access Token',
                        ]
                          .filter(Boolean)
                          .join(' or '),
                      )} to unlock private access.`
                    : 'You may need the "repo" permission scope. Please try logging in again or contact us if this persists.'
                }
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
        lastFetchSuccessAt={mainSubscription.data.lastFetchSuccessAt}
        refresh={refresh}
      />
    )
  },
)

EventCardsContainer.displayName = 'EventCardsContainer'
