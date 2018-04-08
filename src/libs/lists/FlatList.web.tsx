import React, { PureComponent } from 'react'

import MetroListView, { IProps as IMetroProps } from './MetroListView'

export interface IProps extends IMetroProps {
  data: IMetroProps['items']
}

export default class FlatList extends PureComponent<IProps> {
  render() {
    return <MetroListView {...this.props} items={this.props.data} />
  }
}
