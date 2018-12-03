import React from 'react'
import { FlatList, View } from 'react-native'

import { GitHubNotification, LoadState } from '@devhub/core/dist/types'
import { ErrorBoundary } from '../../libs/bugsnag'
import { contentPadding } from '../../styles/variables'
import { Button } from '../common/Button'
import { TransparentTextOverlay } from '../common/TransparentTextOverlay'
import { useTheme } from '../context/ThemeContext'
import { EmptyCards } from './EmptyCards'
import { NotificationCard } from './NotificationCard'
import { CardItemSeparator } from './partials/CardItemSeparator'
import { SwipeableNotificationCard } from './SwipeableNotificationCard'

export interface NotificationCardsProps {
  fetchNextPage: ((params?: { perPage?: number }) => void) | undefined
  notifications: GitHubNotification[]
  repoIsKnown?: boolean
  loadState: LoadState
  swipeable?: boolean
}

export function NotificationCards(props: NotificationCardsProps) {
  const theme = useTheme()

  const { fetchNextPage, loadState, notifications } = props

  if (!(notifications && notifications.length))
    return <EmptyCards fetchNextPage={fetchNextPage} loadState={loadState} />

  function keyExtractor(notification: GitHubNotification) {
    return `notification-card-${notification.id}`
  }

  function renderItem({ item: notification }: { item: GitHubNotification }) {
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
            children="Load more"
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
