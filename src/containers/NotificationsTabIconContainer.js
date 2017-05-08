// @flow

import React from 'react'
import { connect } from 'react-redux'

import TabIcon from '../components/TabIcon'
import { notificationsUnreadCountSelector } from '../selectors'
import type { State } from '../utils/types'

const mapStateToProps = (state: State) => ({
  notificationsCount: notificationsUnreadCountSelector(state),
})

@connect(mapStateToProps)
export default class NotificationsTabIconContainer extends React.PureComponent {
  props: {
    notificationsCount: number,
  }

  render() {
    const { notificationsCount, ...props } = this.props

    return <TabIcon badgeCount={notificationsCount} {...props} />
  }
}
