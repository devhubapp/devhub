import React from 'react'
import { FlatList, View } from 'react-native'

import { constants, EnhancedGitHubNotification, LoadState } from '@devhub/core'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { ErrorBoundary } from '../../libs/bugsnag'
import { contentPadding } from '../../styles/variables'
import { Button } from '../common/Button'
import { AnimatedTransparentTextOverlay } from '../common/TransparentTextOverlay'
import { EmptyCards, EmptyCardsProps } from './EmptyCards'
import { NotificationCard } from './NotificationCard'
import { CardItemSeparator } from './partials/CardItemSeparator'
import { SwipeableNotificationCard } from './SwipeableNotificationCard'

export interface NotificationCardsProps {
  columnIndex: number
  errorMessage: EmptyCardsProps['errorMessage']
  fetchNextPage: ((params?: { perPage?: number }) => void) | undefined
  loadState: LoadState
  notifications: EnhancedGitHubNotification[]
  refresh: EmptyCardsProps['refresh']
  repoIsKnown?: boolean
  swipeable?: boolean
}

export const NotificationCards = React.memo((props: NotificationCardsProps) => {
  const {
    columnIndex,
    errorMessage,
    fetchNextPage,
    loadState,
    notifications,
    refresh,
  } = props

  if (columnIndex && columnIndex >= constants.COLUMNS_LIMIT) {
    return (
      <EmptyCards
        errorMessage={`You have reached the limit of ${
          constants.COLUMNS_LIMIT
        } columns. This is to maintain a healthy usage of the GitHub API.`}
        errorTitle="Too many columns"
        fetchNextPage={undefined}
        loadState="error"
        refresh={undefined}
      />
    )
  }

  if (!(notifications && notifications.length))
    return (
      <EmptyCards
        errorMessage={errorMessage}
        fetchNextPage={fetchNextPage}
        loadState={loadState}
        refresh={refresh}
      />
    )

  function keyExtractor(notification: EnhancedGitHubNotification) {
    return `notification-card-${notification.id}`
  }

  function renderItem({
    item: notification,
  }: {
    item: EnhancedGitHubNotification
  }) {
    if (props.swipeable) {
      return (
        <SwipeableNotificationCard
          notification={notification}
          repoIsKnown={props.repoIsKnown}
        />
      )
    }

    return (
      <ErrorBoundary>
        <NotificationCard
          notification={notification}
          repoIsKnown={props.repoIsKnown}
        />
      </ErrorBoundary>
    )
  }

  function renderFooter() {
    if (!fetchNextPage) return <CardItemSeparator />

    return (
      <>
        <CardItemSeparator />
        <View style={{ padding: contentPadding }}>
          <Button
            analyticsLabel={loadState === 'error' ? 'try_again' : 'load_more'}
            children={loadState === 'error' ? 'Oops. Try again' : 'Load more'}
            disabled={loadState !== 'loaded'}
            loading={loadState === 'loading_more'}
            onPress={() => fetchNextPage()}
          />
        </View>
      </>
    )
  }

  return (
    <AnimatedTransparentTextOverlay
      size={contentPadding}
      themeColor="backgroundColor"
      to="vertical"
    >
      <FlatList
        key="notification-cards-flat-list"
        ItemSeparatorComponent={CardItemSeparator}
        ListFooterComponent={renderFooter}
        data={notifications}
        extraData={loadState}
        initialNumToRender={5}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={5}
        removeClippedSubviews
        renderItem={renderItem}
      />
    </AnimatedTransparentTextOverlay>
  )
})
