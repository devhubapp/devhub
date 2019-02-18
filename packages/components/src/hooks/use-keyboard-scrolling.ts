import React from 'react'
import { FlatList, View } from 'react-native'
import { useEmitter } from './use-emitter'

interface KeyboardScrollingConfig {
  ref: React.RefObject<FlatList<View>>
  columnId: string
  length: number
}

export function useKeyboardScrolling({
  ref,
  columnId,
  length,
}: KeyboardScrollingConfig) {
  const [selectedCardIndex, setSelectedCardIndex] = React.useState(0)
  useEmitter(
    'SCROLL_DOWN_COLUMN',
    (payload: { columnId: string }) => {
      if (!ref.current) return
      if (columnId !== payload.columnId) return
      const index = selectedCardIndex + 1
      if (index < length) {
        ref.current.scrollToIndex({
          animated: true,
          index,
        })
        setSelectedCardIndex(index)
      }
    },
    [selectedCardIndex, length],
  )
  useEmitter(
    'SCROLL_UP_COLUMN',
    (payload: { columnId: string }) => {
      if (!ref.current) return
      if (columnId !== payload.columnId) return
      const index = selectedCardIndex - 1
      if (index >= 0) {
        ref.current.scrollToIndex({
          animated: true,
          index,
        })
        setSelectedCardIndex(index)
      }
    },
    [selectedCardIndex, length],
  )
  return selectedCardIndex
}
