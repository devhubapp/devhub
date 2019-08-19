import { useCallback, useMemo, useRef } from 'react'
import { FlatListProps } from 'react-native'

import { ColumnSubscription, EnhancedItem } from '@devhub/core'
import {
  BaseCardProps,
  getCardPropsForItem,
  getCardSizeForProps,
} from '../components/cards/BaseCard.shared'
import { cardItemSeparatorSize } from '../components/cards/partials/CardItemSeparator'
import { FlatListItemLayout } from '../utils/types'

export function useCardGetItemLayout<ItemT extends EnhancedItem>(
  type: ColumnSubscription['type'],
  items: ItemT[] | undefined,
  params: { ownerIsKnown: boolean; repoIsKnown: boolean },
) {
  const cardPropsCacheMapRef = useRef(
    new WeakMap<EnhancedItem, BaseCardProps>(),
  )
  const sizeCacheMapRef = useRef(new WeakMap<EnhancedItem, number>())

  const itemCardProps = useMemo<Array<BaseCardProps | undefined>>(() => {
    const newCacheMap = new WeakMap()

    if (!(items && items.length)) {
      cardPropsCacheMapRef.current = newCacheMap
      return []
    }

    const result = items.map<BaseCardProps>(item => {
      const cached = cardPropsCacheMapRef.current.get(item)
      const value = cached || getCardPropsForItem(type, item, params)
      newCacheMap.set(item, value)

      return value
    })

    cardPropsCacheMapRef.current = newCacheMap

    return result
  }, [items, params.ownerIsKnown, params.repoIsKnown])

  const itemLayouts = useMemo<Array<FlatListItemLayout | undefined>>(() => {
    const newCacheMap = new WeakMap()

    if (!(items && items.length)) {
      sizeCacheMapRef.current = newCacheMap
      return []
    }

    let totalOffset = 0
    const result = items.map<FlatListItemLayout>((item, index) => {
      const cached = sizeCacheMapRef.current.get(item)
      const value = cached || getCardSizeForProps(itemCardProps[index]!) || 0
      newCacheMap.set(item, value)

      const offset = totalOffset
      totalOffset += value + cardItemSeparatorSize

      return {
        index,
        offset,
        length: value,
      }
    })

    sizeCacheMapRef.current = newCacheMap

    return result
  }, [itemCardProps, items, params.ownerIsKnown, params.repoIsKnown])

  const getItemLayout = useCallback<
    NonNullable<FlatListProps<ItemT>['getItemLayout']>
  >((_data, index) => itemLayouts[index]!, [itemLayouts])

  return { getItemLayout, itemCardProps, itemLayouts }
}
