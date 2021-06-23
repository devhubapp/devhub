import { Column } from '@devhub/core'
import _ from 'lodash'
import React, { useCallback, useEffect, useRef } from 'react'
import { FlatListProps, View } from 'react-native'

import { useDynamicRef } from '../../../hooks/use-dynamic-ref'
import { OneList, OneListProps } from '../../../libs/one-list'
import { Platform } from '../../../libs/platform'
import { sharedStyles } from '../../../styles/shared'
import {
  avatarSize,
  contentPadding,
  scaleFactor,
  smallerTextSize,
} from '../../../styles/variables'
import { vibrateHapticFeedback } from '../../../utils/helpers/shared'
import { KeyboardKeyIsPressed } from '../../AppKeyboardShortcuts'
import { getColumnHeaderThemeColors } from '../../columns/ColumnHeader'
import { Avatar } from '../../common/Avatar'
import { FlatListWithOverlay } from '../../common/FlatListWithOverlay'
import { Separator, separatorSize } from '../../common/Separator'
import { Spacer } from '../../common/Spacer'
import { UnreadDot } from '../../common/UnreadDot'
import { ThemedText } from '../../themed/ThemedText'
import { ThemedTouchableOpacity } from '../../themed/ThemedTouchableOpacity'
import { ThemedView } from '../../themed/ThemedView'
import { sizes as cardSizes } from '.././BaseCard.shared'

export interface OwnerItemT {
  avatarURL: string
  hasUnread: boolean
  index: number
  owner: string
  value: boolean | null
}
export interface GenericOwnerFilterBarProps {
  columnType: Column['type'] | undefined
  data: OwnerItemT[]
  onItemPress: (
    item: OwnerItemT,
    action: 'set' | 'replace',
    value: boolean | null,
  ) => void
}

const ownerTextFontSize = smallerTextSize // 12
const ownerTextLineHeight = smallerTextSize + 4 * scaleFactor // 16
const itemWidth = avatarSize + 2 * contentPadding // 72
const itemContentHeight = avatarSize + contentPadding / 2 + ownerTextLineHeight // 64
const itemContentPaddingVertical = cardSizes.cardPaddingVertical
const itemContentWithPaddingHeight =
  itemContentHeight + 2 * itemContentPaddingVertical // 85,33
export const cardsGenericOwnerFilterBarTotalHeight =
  itemContentWithPaddingHeight + separatorSize // 87,33

function getItemKey(item: OwnerItemT, _index: number) {
  return `owner-filter-bar-${item.owner}`
}

const renderScrollComponent = Platform.select<
  () => FlatListProps<any>['renderScrollComponent']
>({
  android: () => {
    const GestureHandlerScrollView =
      require('react-native-gesture-handler').ScrollView
    return (p: any) => <GestureHandlerScrollView {...p} nestedScrollEnabled />
  },
  default: () => undefined,
})()

export const GenericOwnerFilterBar = React.memo(
  (props: GenericOwnerFilterBarProps) => {
    const { columnType, data, onItemPress: _onItemPress } = props

    const listRef = useRef<typeof OneList>(null)

    const stringifiedData = JSON.stringify(data)

    const firstSelectedItem = data.find((item) => item.value)
    useEffect(() => {
      if (
        listRef.current &&
        firstSelectedItem &&
        firstSelectedItem.index >= 0
      ) {
        try {
          listRef.current.scrollToIndex(firstSelectedItem.index, {
            animated: true,
            alignment: 'center',
          })
        } catch (e) {
          //
        }
      }
    }, [
      listRef.current,
      firstSelectedItem && firstSelectedItem.index,
      stringifiedData,
    ])

    const forcedValueCountRef = useDynamicRef(
      data.reduce((total, item) => {
        return total + (typeof item.value === 'boolean' ? 1 : 0)
      }, 0),
    )

    const _onItemPressRef = useDynamicRef(_onItemPress)
    const onItemPress = useCallback(
      (item: OwnerItemT) => {
        vibrateHapticFeedback()

        if (KeyboardKeyIsPressed.alt) {
          _onItemPressRef.current(
            item,
            'set',
            item.value === false
              ? columnType === 'issue_or_pr'
                ? true
                : null
              : false,
          )
          return
        }

        if (KeyboardKeyIsPressed.meta || KeyboardKeyIsPressed.shift) {
          _onItemPressRef.current(item, 'set', item.value ? null : true)
          return
        }

        if (item.value === false) {
          _onItemPressRef.current(
            item,
            'set',
            columnType === 'issue_or_pr' ? true : null,
          )
          return
        }

        _onItemPressRef.current(
          item,
          'replace',
          item.value && forcedValueCountRef.current === 1 ? null : true,
        )

        if (listRef.current && item.index >= 0) {
          try {
            listRef.current.scrollToIndex(item.index, {
              animated: true,
              alignment: 'center',
            })
          } catch (e) {
            //
          }
        }
      },
      [columnType],
    )

    const renderItem = useCallback<OneListProps<OwnerItemT>['renderItem']>(
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
            hoverBackgroundThemeColor={getColumnHeaderThemeColors().hover}
            onPress={() => {
              onItemPress(item)
            }}
            onLongPress={() => {
              if (Platform.supportsTouch) {
                KeyboardKeyIsPressed.meta = true
                onItemPress(item)
              }
            }}
            onPressOut={() => {
              if (Platform.supportsTouch) {
                KeyboardKeyIsPressed.meta = false
              }
            }}
            style={[
              {
                width: itemWidth - 2,
                height: itemContentWithPaddingHeight,
                marginHorizontal: 1,
                paddingVertical: cardSizes.cardPaddingVertical,
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

    if (!data.length) return null

    return (
      <ThemedView
        style={[
          sharedStyles.flexGrow,
          { height: cardsGenericOwnerFilterBarTotalHeight },
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
              try {
                listRef.current.scrollToIndex(firstSelectedItem.index, {
                  animated: true,
                  alignment: 'center',
                })
              } catch (e) {
                //
              }
            }
          }}
        >
          <FlatListWithOverlay
            ref={listRef}
            alwaysBounceHorizontal={false}
            bottomOrRightOverlayThemeColor={getColumnHeaderThemeColors().normal}
            data={data}
            horizontal
            keyExtractor={getItemKey}
            overlaySize={itemContentPaddingVertical}
            renderItem={renderItem}
            renderScrollComponent={renderScrollComponent}
            topOrLeftOverlayThemeColor={getColumnHeaderThemeColors().normal}
          />
        </View>

        <Separator horizontal />
      </ThemedView>
    )
  },
)

GenericOwnerFilterBar.displayName = 'GenericOwnerFilterBar'
