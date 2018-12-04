import React from 'react'
import { FlatList, View } from 'react-native'

import { EnhancedGitHubNotification, LoadState } from '@devhub/core/src/types'
import { ErrorBoundary } from '../../libs/bugsnag'
import { contentPadding } from '../../styles/variables'
import { Button } from '../common/Button'
import { TransparentTextOverlay } from '../common/TransparentTextOverlay'
import { useTheme } from '../context/ThemeContext'
import { EmptyCards, EmptyCardsProps } from './EmptyCards'
import { NotificationCard } from './NotificationCard'
import { CardItemSeparator } from './partials/CardItemSeparator'
import { SwipeableNotificationCard } from './SwipeableNotificationCard'

export interface NotificationCardsProps {
  errorMessage: EmptyCardsProps['errorMessage']
  fetchNextPage: ((params?: { perPage?: number }) => void) | undefined
  loadState: LoadState
  notifications: EnhancedGitHubNotification[]
  refresh: EmptyCardsProps['refresh']
  repoIsKnown?: boolean
  swipeable?: boolean
}

export function NotificationCards(props: NotificationCardsProps) {
  const theme = useTheme()

  const {
    errorMessage,
    fetchNextPage,
    loadState,
    notifications,
    refresh,
  } = props

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
    <TransparentTextOverlay
      color={theme.backgroundColor}
      size={contentPadding}
      from="vertical"
    >
      <FlatList
        key="notification-cards-flat-list"
        ItemSeparatorComponent={CardItemSeparator}
        ListFooterComponent={renderFooter}
        data={notifications}
        extraData={loadState}
        keyExtractor={keyExtractor}
        removeClippedSubviews
        renderItem={renderItem}
      />
    </TransparentTextOverlay>
  )
}
