import React, { PureComponent } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import theme from '../../styles/themes/dark'
import { contentPadding } from '../../styles/variables'
import { IGitHubNotification } from '../../types/index'
import { getNotificationReasonTextsAndColor } from '../../utils/helpers/github/notifications'
import {
  getNotificationIconAndColor,
  getOwnerAndRepo,
} from '../../utils/helpers/github/shared'
import NotificationCardHeader from './partials/NotificationCardHeader'
import RepositoryRow from './partials/rows/RepositoryRow'

export interface IProps {
  notification: IGitHubNotification
}

export interface IState {}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.cardBackground,
    paddingHorizontal: contentPadding,
    paddingVertical: 1.5 * contentPadding,
  } as ViewStyle,
})

export default class NotificationCard extends PureComponent<IProps> {
  render() {
    const { notification } = this.props

    const repoFullName =
      notification.repository.full_name || notification.repository.name || ''
    const { owner: repoOwnerName, repo: repoName } = getOwnerAndRepo(
      repoFullName,
    )

    const cardIconDetails = getNotificationIconAndColor(
      notification,
      notification.subject, // TODO: Load commit/issue/pullrequest details
      theme,
    )
    const cardIconName = cardIconDetails.icon
    const cardIconColor = cardIconDetails.color || theme.base04

    const labelDetails = getNotificationReasonTextsAndColor(notification)
    const labelText = labelDetails.label.toLowerCase()
    const labelColor = labelDetails.color

    return (
      <View style={styles.container}>
        <NotificationCardHeader
          cardIconColor={cardIconColor}
          cardIconName={cardIconName}
          labelColor={labelColor}
          labelText={labelText}
        />
        {Boolean(repoOwnerName && repoName) && (
          <RepositoryRow
            ownerName={repoOwnerName as string}
            repositoryName={repoName as string}
          />
        )}
      </View>
    )
  }
}
