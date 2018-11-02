import React, { PureComponent } from 'react'

import { MetroListView, MetroListViewProps } from './MetroListView.web'

export interface FlatListProps<Item = any> extends MetroListViewProps<Item> {
  data: MetroListViewProps<Item>['items']
}

export class FlatList<Item = any> extends PureComponent<FlatListProps<Item>> {
  render() {
    return <MetroListView {...this.props} items={this.props.data} />
  }
}
