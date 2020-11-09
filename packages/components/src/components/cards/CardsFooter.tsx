import { Column } from '@devhub/core'
import React from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'

import { useColumnLoadingState } from '../../hooks/use-column-loading-state'
import { shouldRenderFAB } from '../../hooks/use-fab'
import * as actions from '../../redux/actions'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { Button, defaultButtonSize } from '../common/Button'
import { fabSize, fabSpacing } from '../common/FAB'
import { Spacer } from '../common/Spacer'
import { getAppLayout, useAppLayout } from '../context/LayoutContext'
import {
  CardItemSeparator,
  cardItemSeparatorSize,
} from './partials/CardItemSeparator'

export interface CardsFooterProps {
  clearedAt: string | undefined
  columnId: Column['id']
  fetchNextPage: (() => void) | undefined
  isEmpty: boolean
  refresh: (() => void | Promise<void>) | undefined
  topSpacing: number
}

export const CardsFooter = React.memo((props: CardsFooterProps) => {
  const {
    clearedAt,
    columnId,
    fetchNextPage,
    isEmpty,
    refresh,
    topSpacing,
  } = props

  const dispatch = useDispatch()
  const { sizename } = useAppLayout()
  const loadState = useColumnLoadingState(columnId)

  return (
    <View
      style={[
        sharedStyles.fullWidth,
        {
          height: getCardsFooterSize({
            clearedAt,
            hasFetchNextPage: !!fetchNextPage,
            isEmpty,
            topSpacing,
          }),
        },
      ]}
    >
      {!!topSpacing && <Spacer height={topSpacing} />}

      {fetchNextPage ? (
        <View
          style={
            isEmpty
              ? {
                  paddingVertical:
                    fabSpacing + (fabSize - defaultButtonSize) / 2,
                  paddingHorizontal: contentPadding,
                }
              : undefined
          }
        >
          <Button
            analyticsLabel={loadState === 'error' ? 'try_again' : 'load_more'}
            disabled={
              loadState === 'loading' ||
              loadState === 'loading_first' ||
              loadState === 'loading_more'
            }
            loading={loadState === 'loading_more'}
            onPress={fetchNextPage}
            round={isEmpty}
          >
            {loadState === 'error' ? 'Oops. Try again' : 'Load more'}
          </Button>
          {!isEmpty && <CardItemSeparator muted />}
        </View>
      ) : clearedAt ? (
        <View
          style={{
            paddingVertical: fabSpacing + (fabSize - defaultButtonSize) / 2,
            paddingHorizontal: contentPadding,
          }}
        >
          <Button
            analyticsLabel="show_cleared"
            onPress={() => {
              dispatch(
                actions.setColumnClearedAtFilter({
                  clearedAt: null,
                  columnId,
                }),
              )

              if (refresh) void refresh()
            }}
            round
          >
            Show done items
          </Button>
        </View>
      ) : (
        <>
          {isEmpty ? (
            <Spacer
              height={
                fabSpacing +
                (fabSize - defaultButtonSize) / 2 +
                defaultButtonSize
              }
            />
          ) : (
            shouldRenderFAB({ sizename }) && (
              <Spacer height={fabSize + 2 * fabSpacing} />
            )
          )}
        </>
      )}
    </View>
  )
})

CardsFooter.displayName = 'CardsFooter'

export function getCardsFooterSize({
  clearedAt,
  isEmpty,
  hasFetchNextPage,
  topSpacing,
}: {
  clearedAt: string | undefined
  hasFetchNextPage: boolean
  isEmpty: boolean
  topSpacing: number
}) {
  const { sizename } = getAppLayout()

  const buttonVerticalSpacing =
    (fabSpacing + (fabSize - defaultButtonSize) / 2) * 2 + defaultButtonSize

  return (
    (hasFetchNextPage
      ? isEmpty
        ? buttonVerticalSpacing
        : defaultButtonSize + cardItemSeparatorSize
      : clearedAt
      ? buttonVerticalSpacing
      : isEmpty
      ? fabSpacing + (fabSize - defaultButtonSize) / 2 + defaultButtonSize
      : shouldRenderFAB({ sizename })
      ? fabSize + 2 * fabSpacing
      : 0) + (topSpacing || 0)
  )
}
