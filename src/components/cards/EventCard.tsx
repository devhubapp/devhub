import React, { PureComponent } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import theme from '../../styles/themes/dark'
import { contentPadding } from '../../styles/variables'
import { IGitHubEvent } from '../../types/index'
import { getOwnerAndRepo } from '../../utils/helpers/github/shared'
import CardHeader from './partials/CardHeader'
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

    return (
      <View style={styles.container}>
        <CardHeader event={event} />
        {Boolean(event.repo && orgName && repoName) && (
          <RepositoryRow owner={orgName as string} repository={repoName as string} />
        )}
      </View>
    )
  }
}
