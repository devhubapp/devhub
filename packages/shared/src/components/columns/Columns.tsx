import React, { PureComponent } from 'react'
import {
  FlatList,
  FlatListProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native'

import { Column, Omit } from '../../types'
import { DimensionsConsumer } from '../context/DimensionsContext'
import { EventColumn } from './EventColumn'
import { NotificationColumn } from './NotificationColumn'

export interface ColumnsProps
  extends Omit<FlatListProps<Column>, 'renderItem'> {
  contentContainerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
})

export class Columns extends PureComponent<ColumnsProps> {
  pagingEnabled: boolean = true
  swipeable: boolean = false

  keyExtractor(column: Column) {
    return `column-container-${column.id}`
  }

  renderItem: FlatListProps<Column>['renderItem'] = ({
    item: column,
    index,
  }) => {
    switch (column.type) {
      case 'notifications': {
        return (
          <NotificationColumn
            key={`notification-column-${column.id}`}
            column={column}
            columnIndex={index}
            pagingEnabled={this.pagingEnabled}
            swipeable={this.swipeable}
          />
        )
      }

      case 'activity': {
        return (
          <EventColumn
            key={`event-column-${column.id}`}
            column={column}
            columnIndex={index}
            pagingEnabled={this.pagingEnabled}
            swipeable={this.swipeable}
          />
        )
      }

      default: {
        console.error('Invalid Column type: ', (column as any).type)
        return null
      }
    }
  }

  render() {
    const { data, style, ...props } = this.props

    return (
      <DimensionsConsumer>
        {({ width }) => {
          this.pagingEnabled = width <= 400

          return (
            <FlatList
              key="columns-flat-list"
              bounces={!this.swipeable}
              className="snap-container"
              data={data}
              horizontal
              keyExtractor={this.keyExtractor}
              pagingEnabled={this.pagingEnabled}
              removeClippedSubviews
              scrollEnabled={!this.swipeable}
              {...props}
              renderItem={this.renderItem}
              style={[styles.container, style]}
            />
          )
        }}
      </DimensionsConsumer>
    )
  }
}
