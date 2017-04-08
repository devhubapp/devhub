// @flow

import React from 'react';
import { connect } from 'react-redux';

import TabIcon from '../components/TabIcon';
import { notificationsUnreadCountSelector } from '../selectors';
import type { State } from '../utils/types';

const mapStateToProps = (state: State) => ({
  unreadCount: notificationsUnreadCountSelector(state),
});

@connect(mapStateToProps)
export default class extends React.PureComponent {
  props: {
    unreadCount: number,
  };

  render() {
    const { unreadCount, ...props } = this.props;

    return <TabIcon badge={unreadCount} {...props} />;
  }
}
