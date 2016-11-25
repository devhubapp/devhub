import React from 'react';
import { ListView, View } from 'react-native';

export default class extends React.Component {
  constructor(props) {
    super(props);

    const { data, rowHasChanged: _rowHasChanged } = props;

    this.state.data = data || [];

    const rowHasChanged = _rowHasChanged !== undefined ? _rowHasChanged : this.rowHasChanged;
    const ds = new ListView.DataSource({ rowHasChanged });
    this.state.dataSource = ds.cloneWithRows(this.state.data);
  }

  state = {
    dataSource: null,
  };

  componentWillReceiveProps({ data }) {
    const { data: oldData } = this.props;

    if (data !== oldData) {
      const dataSource = this.state.dataSource.cloneWithRows(data || []);
      this.setState({ dataSource });
    }
  }

  rowHasChanged = (r1, r2) => r1 !== r2;

  props: {
    data: Array,
    rowHasChanged?: Function,
    style?: ?Object,
    contentContainerStyle?: ?Object,
    renderRow: Function,
    renderHeader?: Function,
    renderFooter?: Function,
    showBorderSeparator: boolean,
  };

  renderHeader = renderHeader => (
    <View>
      {typeof renderHeader === 'function' ? renderHeader() : null}
    </View>
  );

  renderFooter = renderFooter => (
    <View>
      {typeof renderFooter === 'function' ? renderFooter() : null}
    </View>
  );

  render() {
    const { renderHeader, renderFooter, ...props } = this.props;

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderHeader={() => this.renderHeader(renderHeader)}
        renderFooter={() => this.renderFooter(renderFooter)}
        enableEmptySections
        {...props}
      />
    );
  }
}
