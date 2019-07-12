import * as React from 'react'

export * from 'react-window'

declare module 'react-window' {
  import * as RW from 'react-window'

  export interface DynamicSizeListProps extends RW.ListProps {
    estimatedItemSize?: number
  }

  export class DynamicSizeList extends React.Component<DynamicSizeListProps> {
    scrollTo(scrollOffset: number): void
    scrollToItem(index: number, align?: RW.Align): void
  }
}
