import { noop } from 'lodash'
import { useEffect } from 'react'
import Sortable, { Options } from 'sortablejs'

interface DraggableRefContainer {
  current: any
}

export function useDraggable(
  container: () => HTMLElement | null,
  options?: Options,
  inputs?: any[],
) {
  useEffect(() => {
    const node = container()

    if (!node) return

    const sortable = new Sortable(node, {
      draggable: '.draggable-source',
      ...options,
    })

    return () => sortable.destroy()
  }, inputs)
}
