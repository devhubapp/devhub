import React from 'react';
import { ListView } from 'react-native';

export default class extends React.PureComponent {
  constructor(props) {
    super(props);

    const { data, dataSource, rowHasChanged: _rowHasChanged } = props;

    this.state.data = data || [];

    const rowHasChanged = _rowHasChanged !== undefined ? _rowHasChanged : this.rowHasChanged;
    const ds = dataSource || new ListView.DataSource({ rowHasChanged });
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
    dataSource?: ?Object,
    rowHasChanged?: Function,
    style?: ?Object,
    contentContainerStyle?: ?Object,
    renderRow: Function,
    renderHeader?: Function,
    renderFooter?: Function,
  };

  render() {
    const { ...props } = this.props;
    delete props.dataSource;

    return (
      <ListView
        dataSource={this.state.dataSource}
        enableEmptySections
        {...props}
      />
    );
  }
}
