import { useState } from 'react'
import { FlatList, View } from 'react-native'
import { useEmitter } from './use-emitter'

export function useKeyboardScrolling({
  ref,
  columnId,
  currentOffset,
}: {
  ref: React.RefObject<FlatList<View>>
  columnId: string
  currentOffset: number
}) {
  const [scrolling, setScrolling] = useState(false)

  useEmitter(
    'SCROLL_DOWN_COLUMN',
    (payload: { columnId: string }) => {
      if (!ref.current) return
      if (columnId !== payload.columnId) return
      if (scrolling) return
      setScrolling(true)
      const target = currentOffset + 300
      ref.current.scrollToOffset({
        animated: true,
        offset: target,
      })
      setTimeout(() => setScrolling(false), 100)
    },
    [currentOffset, scrolling],
  )

  useEmitter(
    'SCROLL_UP_COLUMN',
    (payload: { columnId: string }) => {
      if (!ref.current) return
      if (columnId !== payload.columnId) return
      if (scrolling) return
      setScrolling(true)
      const target = currentOffset - 300
      ref.current.scrollToOffset({
        animated: true,
        offset: target,
      })
      setTimeout(() => setScrolling(false), 100)
    },
    [currentOffset, scrolling],
  )
}
