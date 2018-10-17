import React, { PureComponent } from 'react'

import { IProps as IMetroProps, MetroListView } from './MetroListView.web'

export interface IProps extends IMetroProps {
  data: IMetroProps['items']
}

export class FlatList extends PureComponent<IProps> {
  render() {
    return <MetroListView {...this.props} items={this.props.data} />
  }
}
