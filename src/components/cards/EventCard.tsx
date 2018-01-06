import React, { PureComponent } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import theme from '../../styles/themes/dark'
import { contentPadding } from '../../styles/variables'
import { IGitHubEvent } from '../../types/index'
import {
  getEventIconAndColor,
  getEventText,
} from '../../utils/helpers/github/events'
import { getOwnerAndRepo } from '../../utils/helpers/github/shared'
import EventCardHeader from './partials/EventCardHeader'
import RepositoryRow from './partials/rows/RepositoryRow'

export interface IProps {
  event: IGitHubEvent
}

export interface IState {}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.cardBackground,
    paddingHorizontal: contentPadding,
    paddingVertical: 1.5 * contentPadding,
  } as ViewStyle,
})

export default class EventCard extends PureComponent<IProps> {
  render() {
    const { event } = this.props

    const repoFullName = event.repo.full_name || event.repo.name || ''
    const { owner: orgName, repo: repoName } = getOwnerAndRepo(repoFullName)

    const cardIconDetails = getEventIconAndColor(event, theme)
    const cardIconName = cardIconDetails.subIcon || cardIconDetails.icon
    const cardIconColor = cardIconDetails.color || theme.base04

    const actionText = getEventText(event)

    return (
      <View style={styles.container}>
        <EventCardHeader
          actionText={actionText}
          cardIconColor={cardIconColor}
          cardIconName={cardIconName}
          username={event.actor.login}
        />
        {Boolean(event.repo && orgName && repoName) && (
          <RepositoryRow
            owner={orgName as string}
            repository={repoName as string}
          />
        )}
      </View>
    )
  }
}
