import React, { PureComponent } from 'react'

import { MetroListView, MetroListViewProps } from './MetroListView.web'

export interface FlatListProps extends MetroListViewProps {
  data: MetroListViewProps['items']
}

export class FlatList extends PureComponent<FlatListProps> {
  render() {
    return <MetroListView {...this.props} items={this.props.data} />
  }
}
