import React, { useCallback, useMemo, useRef } from 'react'
import { View } from 'react-native'

import { Column, EnhancedItem } from '@devhub/core'
import { useHover } from '../../hooks/use-hover'
import { useIsItemFocused } from '../../hooks/use-is-item-focused'
import { emitter } from '../../libs/emitter'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { tryFocus } from '../../utils/helpers/shared'
import { getCardBackgroundThemeColor } from '../columns/ColumnRenderer'
import { Link } from '../common/Link'
import { getTheme } from '../context/ThemeContext'
import { BaseCard } from './BaseCard'
import { BaseCardProps, getCardPropsForItem } from './BaseCard.shared'
import { CardFocusIndicator } from './partials/CardFocusIndicator'
import { CardSavedIndicator } from './partials/CardSavedIndicator'

export interface CardWithLinkProps<ItemT extends EnhancedItem> {
  cachedCardProps?: BaseCardProps | undefined
  columnId: string
  item: ItemT
  ownerIsKnown: boolean
  repoIsKnown: boolean
  swipeable: boolean
  type: Column['type']
}

export const CardWithLink = React.memo(
  (props: CardWithLinkProps<EnhancedItem>) => {
    const {
      cachedCardProps,
      columnId,
      item,
      ownerIsKnown,
      repoIsKnown,
      type,
    } = props

    const ref = useRef<any>(null)
    const focusIndicatorRef = useRef<View>(null)
    const isFocusedRef = useRef(false)

    const { CardComponent, cardProps } = useMemo(() => {
      const _cardProps =
        cachedCardProps ||
        getCardPropsForItem(type, item, {
          ownerIsKnown,
          repoIsKnown,
        })

      return {
        cardProps: _cardProps,
        CardComponent: (
          <BaseCard key={`${type}-base-card-${item.id}`} {..._cardProps} />
        ),
      }
    }, [cachedCardProps, item, ownerIsKnown, repoIsKnown])

    const isReadRef = useRef(cardProps.isRead)
    isReadRef.current = cardProps.isRead

    const handleFocusChange = useCallback(
      (value, disableDomFocus?: boolean) => {
        const changed = isFocusedRef.current !== value
        isFocusedRef.current = value

        if (ref.current) {
          const theme = getTheme()

          ref.current.setNativeProps({
            style: {
              backgroundColor:
                theme[
                  getCardBackgroundThemeColor({
                    isDark: theme.isDark,
                    isMuted: isReadRef.current,
                    isHovered: value,
                  })
                ],
            },
          })

          if (Platform.OS === 'web' && value && changed && !disableDomFocus) {
            tryFocus(ref.current)
          }
        }

        if (focusIndicatorRef.current) {
          focusIndicatorRef.current.setNativeProps({
            style: { opacity: !Platform.supportsTouch && value ? 1 : 0 },
          })
        }
      },
      [],
    )

    useIsItemFocused(columnId, item.id, handleFocusChange)

    useHover(
      ref,
      useCallback(
        isHovered => {
          if (isFocusedRef.current === isHovered) return
          if (!isHovered) return

          handleFocusChange(isHovered)
          emitter.emit('FOCUS_ON_COLUMN_ITEM', {
            columnId,
            itemId: item.id,
          })
        },
        [columnId, item.id, cardProps.isRead],
      ),
    )

    return (
      <Link
        ref={ref}
        backgroundThemeColor={theme =>
          getCardBackgroundThemeColor({
            isDark: theme.isDark,
            isMuted: cardProps.isRead,
            isHovered: isFocusedRef.current,
          })
        }
        data-card-link
        enableBackgroundHover={false}
        enableForegroundHover={false}
        href={cardProps.link}
        openOnNewTab
        style={sharedStyles.relative}
        onFocus={() => {
          if (isFocusedRef.current) return

          handleFocusChange(true, true)

          emitter.emit('FOCUS_ON_COLUMN_ITEM', {
            columnId,
            itemId: item.id,
          })
        }}
        onBlur={() => {
          handleFocusChange(false, true)
        }}
      >
        {CardComponent}

        <CardFocusIndicator
          ref={focusIndicatorRef}
          style={{
            opacity: !Platform.supportsTouch && isFocusedRef.current ? 1 : 0,
          }}
        />

        {!!item.saved && <CardSavedIndicator />}
      </Link>
    )
  },
)

CardWithLink.displayName = 'CardWithLink'
