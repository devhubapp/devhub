import React from 'react'
import { View } from 'react-native'

import { Column } from '@devhub/core'
import { useDispatch } from 'react-redux'
import { useColumnLoadingState } from '../../hooks/use-column-loading-state'
import * as actions from '../../redux/actions'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { Button, defaultButtonSize } from '../common/Button'
import { fabSize } from '../common/FAB'
import { fabSpacing, shouldRenderFAB } from '../common/FABRenderer'
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
  isCardSeparatorMuted: boolean
  isEmpty: boolean
  refresh: (() => void | Promise<void>) | undefined
}

export const CardsFooter = React.memo((props: CardsFooterProps) => {
  const {
    clearedAt,
    columnId,
    fetchNextPage,
    isCardSeparatorMuted,
    isEmpty,
    refresh,
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
          }),
        },
      ]}
    >
      {!isEmpty && <CardItemSeparator muted={isCardSeparatorMuted} />}

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
            children={loadState === 'error' ? 'Oops. Try again' : 'Load more'}
            disabled={
              loadState === 'loading' ||
              loadState === 'loading_first' ||
              loadState === 'loading_more'
            }
            loading={loadState === 'loading_more'}
            onPress={fetchNextPage}
            round={isEmpty}
          />
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
            children="Show cleared items"
            onPress={() => {
              dispatch(
                actions.setColumnClearedAtFilter({
                  clearedAt: null,
                  columnId,
                }),
              )

              if (refresh) refresh()
            }}
            round
          />
        </View>
      ) : (
        <>
          {!isEmpty && shouldRenderFAB({ sizename }) && (
            <Spacer height={fabSize + 2 * fabSpacing} />
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
}: {
  clearedAt: string | undefined
  hasFetchNextPage: boolean
  isEmpty: boolean
}) {
  const { sizename } = getAppLayout()

  const buttonVerticalSpacing =
    (fabSpacing + (fabSize - defaultButtonSize) / 2) * 2 + defaultButtonSize
  return (
    (!isEmpty ? cardItemSeparatorSize : 0) +
    (hasFetchNextPage
      ? isEmpty
        ? buttonVerticalSpacing
        : defaultButtonSize
      : clearedAt
      ? buttonVerticalSpacing
      : !isEmpty && shouldRenderFAB({ sizename })
      ? fabSize + 2 * fabSpacing
      : 0)
  )
}
