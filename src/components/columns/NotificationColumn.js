// @flow

import React from 'react'
import { Dimensions } from 'react-native'
import { Iterable, List, Set } from 'immutable'

import ActionSheet from '../ActionSheet'
import ColumnWithList, {
  headerHeight,
  HeaderButton,
  HeaderButtonIcon,
  HeaderButtonsContainer,
} from './_ColumnWithList'
import { defaultIcon as summaryIcon } from './NotificationsFilterColumn'
import NotificationsFilterColumnContainer
  from '../../containers/NotificationsFilterColumnContainer'
import NotificationCardContainer
  from '../../containers/NotificationCardContainer'
import Platform from '../../libs/platform'
import { FullAbsoluteView, FullView } from '../cards/__CardComponents'
import { getOwnerAndRepo } from '../../utils/helpers/github/shared'
import { getParamsToLoadAllNotifications } from '../../sagas/notifications'
import { readNotificationIdsSelector } from '../../selectors/notifications'
import type { ActionCreators, GithubRepo } from '../../utils/types'

const isWebWithBigHeight =
  Platform.realOS === 'web' && Dimensions.get('screen').height > 500

export const defaultIcon = 'bell'
export const defaultTitle = 'notifications'

export default class NotificationColumn extends React.PureComponent {
  static contextTypes = { store: React.PropTypes.object.isRequired }

  static defaultProps = {
    icon: undefined,
    title: undefined,
    style: undefined,
    repo: undefined,
  }

  state = {
    summary: false,
  }

  onRefresh = () => {
    const { actions: { updateNotifications } } = this.props

    const params = getParamsToLoadAllNotifications()
    updateNotifications(params)
  }

  getNotificationIds = () => {
    const { items = List() } = this.props
    return typeof items.first() === 'string'
      ? items
      : items
          .map(item => (Iterable.isIterable(item) ? item.get('id') : item))
          .toList()
  }

  getReadNotificationIds = () => {
    const store = this.context.store
    const state = store.getState()

    const notificationIds = this.getNotificationIds()
    const readNotificationIds = readNotificationIdsSelector(state)
    return Set(readNotificationIds).intersect(notificationIds)
  }

  getUnreadNotificationIds = () => {
    const notificationIds = this.getNotificationIds()
    const readNotificationIds = this.getReadNotificationIds()
    return Set(notificationIds).subtract(readNotificationIds)
  }

  getRightHeader = isSummary => (
    <HeaderButtonsContainer>
      <HeaderButton onPress={this.toggleSummary}>
        <HeaderButtonIcon name={summaryIcon} active={isSummary} />
      </HeaderButton>

      <HeaderButton onPress={this.showActionSheet} disabled={isSummary}>
        <HeaderButtonIcon name="chevron-down" muted={isSummary} />
      </HeaderButton>
    </HeaderButtonsContainer>
  )

  toggleSummary = () => {
    this.setState(({ summary }) => ({ summary: !summary }))
  }

  showActionSheet = () => {
    const { actions, column, repo } = this.props

    const repoId = repo ? repo.get('id') : column.get('repoId')

    const readIds = this.getReadNotificationIds()
    const notificationIds = this.getNotificationIds()
    const title = (column.get('title') || '').toLowerCase()

    this.ActionSheet.show('', !isWebWithBigHeight && title, [
      {
        text: 'Mark all as read / unread',
        onPress: () => {
          if (readIds && readIds.size >= notificationIds.size) {
            actions.markNotificationsAsUnread({
              all: true,
              notificationIds: readIds,
              repoId,
            })
          } else {
            const unreadIds = this.getUnreadNotificationIds()
            actions.markNotificationsAsReadRequest({
              all: true,
              notificationIds: unreadIds,
              repoId,
            })
          }
        },
      },
      {
        text: 'Clear read',
        onPress: () => {
          const all = readIds.size === notificationIds.size
          actions.deleteNotifications({
            all,
            notificationIds: readIds,
            repoId,
          })
        },
      },
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
    ])
  }

  props: {
    actions: ActionCreators,
    column: { repoId: string },
    icon?: string,
    items: Array<Object>,
    loading: boolean,
    notificationsDetails: Object,
    style?: ?Object,
    readIds: Array<string>,
    repo?: GithubRepo,
    title?: string,
    updatedAt: Date,
  }

  renderItem = ({ item: notificationOrNotificationId }) => {
    const { actions, column, repo } = this.props

    const notification = Iterable.isIterable(notificationOrNotificationId)
      ? notificationOrNotificationId
      : null

    const notificationId = notification
      ? `${notification.get('id')}`
      : notificationOrNotificationId
    if (!notificationId) return null

    return (
      <NotificationCardContainer
        key={`notification-card-container-${notificationId}`}
        actions={actions}
        notificationOrNotificationId={notificationId}
        onlyOneRepository={!!(repo || column.get('repoId'))}
      />
    )
  }

  render() {
    const { summary } = this.state
    const {
      column,
      icon: _icon,
      items,
      repo,
      style,
      title: _title,
      ...props
    } = this.props

    if (!column) return null

    let title = _title
    if (!title) {
      if (repo) {
        const { repo: repoName } = getOwnerAndRepo(
          repo.get('full_name') || repo.get('name'),
        )
        title = (repoName || '').toLowerCase()
      }

      if (!title) title = defaultTitle
    }

    let icon = _icon
    if (!icon) {
      icon = repo || column.get('repoId') ? 'repo' : defaultIcon
    }

    return (
      <FullView style={style}>
        <ColumnWithList
          {...props}
          key={`notification-_ColumnWithList-${column.get('id')}`}
          rightHeader={this.getRightHeader(false)}
          icon={icon}
          items={items}
          title={title}
          onRefresh={this.onRefresh}
          renderItem={this.renderItem}
        />

        <ActionSheet
          containerStyle={
            isWebWithBigHeight && {
              position: 'absolute',
              top: headerHeight,
              left: 0,
              right: 0,
            }
          }
          innerRef={ref => {
            this.ActionSheet = ref
          }}
        />

        {summary &&
          <FullAbsoluteView
            key={`notifications-fcc-${column.get('id')}-FullAbsoluteView`}
          >
            <NotificationsFilterColumnContainer
              {...props}
              key={`notifications-filter-column-container-${column.get('id')}`}
              column={column}
              icon={icon}
              title={title}
              onRefresh={this.onRefresh}
              renderItem={this.renderItem}
              rightHeader={this.getRightHeader(true)}
            />
          </FullAbsoluteView>}
      </FullView>
    )
  }
}
