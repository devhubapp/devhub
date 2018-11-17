import React from 'react'
import { Dimensions, ScaledSize } from 'react-native'

import { sidebarSize } from '../../styles/variables'
import { MAX_COLUMN_WIDTH, MIN_COLUMN_WIDTH } from '../../utils/constants'
import { getLayoutConsumerState, LAYOUT_BREAKPOINTS } from './LayoutContext'

export interface ColumnSizeProviderProps {
  children?: React.ReactNode
}

export interface ColumnSizeProviderState {
  width: number
}

export const ColumnSizeContext = React.createContext<ColumnSizeProviderState>({
  width: calculateColumnWidth({ window: Dimensions.get('window') }),
})

export class ColumnSizeProvider extends React.PureComponent<
  ColumnSizeProviderProps,
  ColumnSizeProviderState
> {
  constructor(props: ColumnSizeProviderProps) {
    super(props)

    this.state = {
      width: calculateColumnWidth({ window: Dimensions.get('window') }),
    }
  }

  updateDimensions = ({ window }: { window: ScaledSize }) => {
    const width = calculateColumnWidth({ window })

    this.setState(state => (width === state.width ? undefined : { width }))
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.updateDimensions)
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateDimensions)
  }

  render() {
    return (
      <ColumnSizeContext.Provider value={this.state}>
        {this.props.children}
      </ColumnSizeContext.Provider>
    )
  }
}

export const ColumnSizeConsumer = ColumnSizeContext.Consumer

function calculateColumnWidth({
  window,
  minWidth: _minWidth = MIN_COLUMN_WIDTH,
  maxWidth: _maxWidth = MAX_COLUMN_WIDTH,
}: {
  window: { width: number; height: number }
  minWidth?: number
  maxWidth?: number
}) {
  const horizontal = getLayoutConsumerState().appOrientation === 'landscape'

  const availableWidth = window.width - (horizontal ? sidebarSize : 0)

  const minWidth = _minWidth && _minWidth > 0 ? _minWidth : 0
  const maxWidth = Math.min(
    window.width <= LAYOUT_BREAKPOINTS.SMALL
      ? availableWidth
      : _maxWidth && _maxWidth >= 0
      ? _maxWidth
      : availableWidth,
    window.width,
  )

  return Math.max(minWidth, maxWidth)
}
