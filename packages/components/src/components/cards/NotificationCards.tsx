import React from 'react'
import { FlatList, View } from 'react-native'

import {
  Column,
  constants,
  EnhancedGitHubNotification,
  LoadState,
} from '@devhub/core'
import { useKeyboardScrolling } from '../../hooks/use-keyboard-scrolling'
import { useReduxAction } from '../../hooks/use-redux-action'
import { ErrorBoundary } from '../../libs/bugsnag'
import * as actions from '../../redux/actions'
import { contentPadding } from '../../styles/variables'
import { Button } from '../common/Button'
import { FlatListWithOverlay } from '../common/FlatListWithOverlay'
import { EmptyCards, EmptyCardsProps } from './EmptyCards'
import { NotificationCard } from './NotificationCard'
import { CardItemSeparator } from './partials/CardItemSeparator'
import { SwipeableNotificationCard } from './SwipeableNotificationCard'

export interface NotificationCardsProps {
  column: Column
  columnIndex: number
  errorMessage: EmptyCardsProps['errorMessage']
  fetchNextPage: (() => void) | undefined
  loadState: LoadState
  notifications: EnhancedGitHubNotification[]
  refresh: EmptyCardsProps['refresh']
  repoIsKnown?: boolean
  swipeable?: boolean
}

export const NotificationCards = React.memo((props: NotificationCardsProps) => {
  const {
    column,
    columnIndex,
    errorMessage,
    fetchNextPage,
    loadState,
    notifications,
    refresh,
  } = props

  const flatListRef = React.useRef<FlatList<View>>(null)

  useKeyboardScrolling({
    ref: flatListRef,
    columnId: column.id,
    length: notifications.length,
  })

  const setColumnClearedAtFilter = useReduxAction(
    actions.setColumnClearedAtFilter,
  )

  if (columnIndex && columnIndex >= constants.COLUMNS_LIMIT) {
    return (
      <EmptyCards
        clearedAt={column.filters && column.filters.clearedAt}
        columnId={column.id}
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
        clearedAt={column.filters && column.filters.clearedAt}
        columnId={column.id}
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
    return (
      <>
        <CardItemSeparator />

        {fetchNextPage ? (
          <View style={{ padding: contentPadding }}>
            <Button
              analyticsLabel={loadState === 'error' ? 'try_again' : 'load_more'}
              children={loadState === 'error' ? 'Oops. Try again' : 'Load more'}
              disabled={loadState !== 'loaded'}
              loading={
                loadState === 'loading_first' || loadState === 'loading_more'
              }
              onPress={fetchNextPage}
            />
          </View>
        ) : column.filters && column.filters.clearedAt ? (
          <View style={{ padding: contentPadding }}>
            <Button
              analyticsLabel="show_cleared"
              borderOnly
              children="Show cleared items"
              disabled={loadState !== 'loaded'}
              onPress={() => {
                setColumnClearedAtFilter({
                  clearedAt: null,
                  columnId: column.id,
                })

                if (refresh) refresh()
              }}
            />
          </View>
        ) : null}
      </>
    )
  }

  return (
    <FlatListWithOverlay
      ref={flatListRef}
      key="notification-cards-flat-list"
      ItemSeparatorComponent={CardItemSeparator}
      ListFooterComponent={renderFooter}
      data={notifications}
      extraData={loadState}
      initialNumToRender={10}
      keyExtractor={keyExtractor}
      removeClippedSubviews
      renderItem={renderItem}
    />
  )
})
