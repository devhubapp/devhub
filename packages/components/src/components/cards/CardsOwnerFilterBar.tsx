import {
  Column,
  getFilteredItems,
  getItemsFilterMetadata,
  getOwnerAndRepoFormattedFilter,
  getUserAvatarByUsername,
} from '@devhub/core'
import _ from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { PixelRatio, View } from 'react-native'
import { useDispatch } from 'react-redux'

import { useColumn } from '../../hooks/use-column'
import { useColumnData } from '../../hooks/use-column-data'
import { useDynamicRef } from '../../hooks/use-dynamic-ref'
import useKeyPressCallback from '../../hooks/use-key-press-callback'
import { useReduxState } from '../../hooks/use-redux-state'
import { OneList, OneListProps } from '../../libs/one-list'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import {
  avatarSize,
  contentPadding,
  smallerTextSize,
} from '../../styles/variables'
import { getColumnHeaderThemeColors } from '../columns/ColumnHeader'
import { Avatar } from '../common/Avatar'
import { Separator, separatorSize } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import { UnreadDot } from '../common/UnreadDot'
import { ThemedText } from '../themed/ThemedText'
import { ThemedTouchableOpacity } from '../themed/ThemedTouchableOpacity'
import { ThemedView } from '../themed/ThemedView'
import { sizes as cardSizes } from './BaseCard.shared'

export interface CardsOwnerFilterBarProps {
  columnId: Column['id']
  key: string
}

const ownerTextFontSize = smallerTextSize // 12
const ownerTextLineHeight = smallerTextSize + 4 // 16
const itemWidth = avatarSize + 2 * contentPadding // 72
const itemContentHeight = avatarSize + contentPadding / 2 + ownerTextLineHeight // 64
const itemContentWithPaddingHeight =
  itemContentHeight + 2 * cardSizes.cardPadding // 85,33
export const cardsOwnerFilterBarTotalHeight =
  itemContentWithPaddingHeight + separatorSize // 87,33

interface ItemT {
  avatarURL: string
  hasUnread: boolean
  index: number
  owner: string
  value: boolean | null
}

function getItemKey(item: ItemT, _index: number) {
  return `owner-filter-bar-${item.owner}`
}

function getItemSize() {
  return itemWidth
}

const ownersCacheByColumnId = new Map<string, Set<string>>()

export const CardsOwnerFilterBar = React.memo(
  (props: CardsOwnerFilterBarProps) => {
    const { columnId } = props

    const { column } = useColumn(columnId)
    const { allItems } = useColumnData(columnId)

    const dispatch = useDispatch()
    const plan = useReduxState(selectors.currentUserPlanSelector)

    const listRef = useRef<typeof OneList>(null)

    const altKeyIsPressedRef = useRef(false)
    useKeyPressCallback(
      'Alt',
      useCallback(() => {
        altKeyIsPressedRef.current = true
      }, []),
      useCallback(() => {
        altKeyIsPressedRef.current = false
      }, []),
    )

    const shiftKeyIsPressedRef = useRef(false)
    useKeyPressCallback(
      'Shift',
      useCallback(() => {
        shiftKeyIsPressedRef.current = true
      }, []),
      useCallback(() => {
        shiftKeyIsPressedRef.current = false
      }, []),
    )

    const metaKeyIsPressedRef = useRef(false)
    useKeyPressCallback(
      'Meta',
      useCallback(() => {
        metaKeyIsPressedRef.current = true
      }, []),
      useCallback(() => {
        metaKeyIsPressedRef.current = false
      }, []),
    )

    const getFilteredItemsOptions = useMemo<
      Parameters<typeof getFilteredItems>[3]
    >(
      () => ({
        mergeSimilar: false,
        plan,
      }),
      [plan],
    )

    const { allForcedOwners, allForcedRepos, ownerFilters } = useMemo(
      () => getOwnerAndRepoFormattedFilter(column && column.filters),
      [column && column.filters],
    )

    const ownerOrRepoFilteredItemsMetadata = useMemo(
      () =>
        column &&
        getItemsFilterMetadata(
          column.type,
          getFilteredItems(
            column.type,
            allItems,
            {
              ...column.filters,
              owners: undefined,
            },
            getFilteredItemsOptions,
          ),
          {
            forceIncludeTheseOwners: allForcedOwners,
            forceIncludeTheseRepos: allForcedRepos,
            plan,
          },
        ),
      [
        column && column.type,
        allItems,
        column && column.filters,
        allForcedOwners,
        allForcedRepos,
        plan,
      ],
    )

    let owners = Object.keys(
      (ownerOrRepoFilteredItemsMetadata &&
        ownerOrRepoFilteredItemsMetadata.owners) ||
        {},
    )
    owners = ownersCacheByColumnId.get(columnId)
      ? _.uniq(Array.from(ownersCacheByColumnId.get(columnId)!).concat(owners))
      : owners

    const data = owners
      .map((owner, index) => {
        const ownerItem =
          ownerOrRepoFilteredItemsMetadata &&
          ownerOrRepoFilteredItemsMetadata.owners[owner]

        if (column && column.type === 'issue_or_pr') {
          ownersCacheByColumnId.set(
            columnId,
            ownersCacheByColumnId.get(columnId) || new Set(),
          )
          ownersCacheByColumnId.get(columnId)!.add(owner)
        }

        return {
          avatarURL: getUserAvatarByUsername(
            owner,
            { baseURL: undefined },
            PixelRatio.getPixelSizeForLayoutSize,
          ), // TODO: baseURL
          hasUnread: !!(
            ownerItem &&
            ownerItem.metadata &&
            ownerItem.metadata.unread > 0
          ),
          value:
            ownerFilters && typeof ownerFilters[owner] === 'boolean'
              ? ownerFilters[owner]
              : null,
          owner,
          index,
        }
      })
      .filter(Boolean)
      .sort(
        column && column.type === 'issue_or_pr'
          ? () => 0
          : (a, b) =>
              a!.hasUnread && !b!.hasUnread
                ? -1
                : !a!.hasUnread && b!.hasUnread
                ? 1
                : 0,
      ) as ItemT[]

    const stringifiedData = JSON.stringify(data)

    const forcedValueCountRef = useDynamicRef(
      data.reduce((total, item) => {
        return total + (typeof item.value === 'boolean' ? 1 : 0)
      }, 0),
    )

    const onItemPress = useCallback(
      (item: ItemT) => {
        if (altKeyIsPressedRef.current) {
          dispatch(
            actions.setColumnOwnerFilter({
              columnId,
              owner: item.owner,
              value: item.value === false ? null : false,
            }),
          )
          return
        }

        if (metaKeyIsPressedRef.current || shiftKeyIsPressedRef.current) {
          dispatch(
            actions.setColumnOwnerFilter({
              columnId,
              owner: item.owner,
              value: item.value ? null : true,
            }),
          )
          return
        }

        if (item.value === false) {
          dispatch(
            actions.setColumnOwnerFilter({
              columnId,
              owner: item.owner,
              value: null,
            }),
          )
          return
        }

        dispatch(
          actions.replaceColumnOwnerFilter({
            columnId,
            owner:
              item.value && forcedValueCountRef.current === 1
                ? null
                : item.owner,
          }),
        )

        if (listRef.current && item.index >= 0) {
          listRef.current.scrollToIndex(item.index, {
            animated: true,
            alignment: 'smart',
          })
        }
      },
      [columnId],
    )

    const firstSelectedItem = data.find(item => item.value)
    useEffect(() => {
      if (
        listRef.current &&
        firstSelectedItem &&
        firstSelectedItem.index >= 0
      ) {
        listRef.current.scrollToIndex(firstSelectedItem.index, {
          animated: true,
          alignment: 'smart',
        })
      }
    }, [
      listRef.current,
      firstSelectedItem && firstSelectedItem.index,
      stringifiedData,
    ])

    const renderItem = useCallback<OneListProps<ItemT>['renderItem']>(
      ({ item }) => {
        return (
          <ThemedTouchableOpacity
            backgroundColor={
              item.value
                ? getColumnHeaderThemeColors().selected
                : item.value === false
                ? 'backgroundColorTintedRed'
                : getColumnHeaderThemeColors().normal
            }
            onPress={() => {
              onItemPress(item)
            }}
            onLongPress={() => {
              if (Platform.supportsTouch) {
                metaKeyIsPressedRef.current = true
                onItemPress(item)
              }
            }}
            onPressOut={() => {
              if (Platform.supportsTouch) {
                metaKeyIsPressedRef.current = false
              }
            }}
            style={[
              {
                width: itemWidth - 2,
                height: itemContentWithPaddingHeight,
                marginHorizontal: 1,
                paddingVertical: cardSizes.cardPadding,
              },
              item.value === false && sharedStyles.muted,
            ]}
          >
            <View
              style={[
                sharedStyles.center,
                sharedStyles.fullWidth,
                sharedStyles.fullHeight,
              ]}
            >
              <View
                style={[
                  sharedStyles.relative,
                  { width: avatarSize, height: avatarSize },
                ]}
              >
                <Avatar
                  avatarUrl={item.avatarURL}
                  disableLink
                  size={avatarSize}
                  tooltip=""
                  username={item.owner}
                />
                {!!item.hasUnread && (
                  <UnreadDot
                    style={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                    }}
                  />
                )}
              </View>

              <Spacer height={contentPadding / 2} />
              <ThemedText
                color="foregroundColorMuted65"
                numberOfLines={1}
                style={[
                  sharedStyles.textCenter,
                  {
                    paddingHorizontal: contentPadding / 2,
                    lineHeight: ownerTextLineHeight,
                    fontSize: ownerTextFontSize,
                  },
                ]}
              >
                {item.owner}
              </ThemedText>
            </View>
          </ThemedTouchableOpacity>
        )
      },
      [],
    )

    return useMemo(() => {
      if (!(column && owners.length)) return null

      return (
        <ThemedView
          style={[
            sharedStyles.flexGrow,
            { height: cardsOwnerFilterBarTotalHeight },
          ]}
        >
          <View
            style={[
              sharedStyles.flexGrow,
              { height: itemContentWithPaddingHeight },
            ]}
            onLayout={() => {
              if (
                listRef.current &&
                firstSelectedItem &&
                firstSelectedItem.index >= 0
              ) {
                listRef.current.scrollToIndex(firstSelectedItem.index, {
                  animated: true,
                  alignment: 'smart',
                })
              }
            }}
          >
            <OneList
              ref={listRef}
              data={data}
              estimatedItemSize={itemWidth}
              getItemKey={getItemKey}
              getItemSize={getItemSize}
              horizontal
              overscanCount={1}
              renderItem={renderItem}
            />
          </View>

          <Separator horizontal />
        </ThemedView>
      )
    }, [!(column && owners.length), stringifiedData, firstSelectedItem])
  },
)

CardsOwnerFilterBar.displayName = 'CardsOwnerFilterBar'
