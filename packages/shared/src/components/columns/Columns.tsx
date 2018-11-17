import { EventSubscription } from 'fbemitter'
import React, { PureComponent } from 'react'
import {
  FlatList,
  FlatListProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native'

import { ColumnContainer } from '../../containers/ColumnContainer'
import { emitter } from '../../setup'
import { Omit } from '../../types'
import { Separator } from '../common/Separator'
import { LayoutConsumer } from '../context/LayoutContext'

export interface ColumnsProps
  extends Omit<FlatListProps<string>, 'data' | 'renderItem'> {
  contentContainerStyle?: StyleProp<ViewStyle>
  columnIds: string[]
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  flatlist: {
    flex: 1,
  },
})

export class Columns extends PureComponent<ColumnsProps> {
  flatListRef = React.createRef<FlatList<string>>()
  focusOnColumnListener?: EventSubscription
  pagingEnabled: boolean = true
  swipeable: boolean = false

  componentDidMount() {
    this.focusOnColumnListener = emitter.addListener(
      'FOCUS_ON_COLUMN',
      this.handleColumnFocusRequest,
    )
  }

  componentWillUnmount() {
    if (this.focusOnColumnListener) this.focusOnColumnListener.remove()
  }

  handleColumnFocusRequest = ({
    animated,
    columnIndex,
  }: {
    columnId: string
    columnIndex: number
    animated?: boolean
    highlight?: boolean
  }) => {
    if (!this.flatListRef.current) return
    if (!(this.props.columnIds && this.props.columnIds.length)) return

    if (columnIndex >= 0 && columnIndex < this.props.columnIds.length) {
      this.flatListRef.current.scrollToIndex({
        animated,
        index: columnIndex,
      })
    }
  }

  keyExtractor(columnId: string) {
    return `column-container-${columnId}`
  }

  renderItem: FlatListProps<string>['renderItem'] = ({ item: columnId }) => {
    return (
      <ColumnContainer
        columnId={columnId}
        pagingEnabled={this.pagingEnabled}
        swipeable={this.swipeable}
      />
    )
  }

  render() {
    const { columnIds, style, ...props } = this.props

    return (
      <LayoutConsumer>
        {({ sizename }) => {
          this.pagingEnabled = sizename === '1-small'

          return (
            <FlatList
              ref={this.flatListRef}
              key="columns-flat-list"
              ItemSeparatorComponent={Separator}
              ListFooterComponent={
                sizename === '1-small' || (columnIds && columnIds.length)
                  ? Separator
                  : undefined
              }
              ListHeaderComponent={
                sizename === '1-small' ? Separator : undefined
              }
              bounces={!this.swipeable}
              className="snap-container"
              data={columnIds}
              horizontal
              keyExtractor={this.keyExtractor}
              onScrollToIndexFailed={() => undefined}
              pagingEnabled={this.pagingEnabled}
              removeClippedSubviews
              scrollEnabled={!this.swipeable}
              {...props}
              renderItem={this.renderItem}
              style={[styles.flatlist, style]}
            />
          )
        }}
      </LayoutConsumer>
    )
  }
}
