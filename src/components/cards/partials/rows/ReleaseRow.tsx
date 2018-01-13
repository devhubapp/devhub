import React, { SFC } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Octicons'

import { IGitHubEventType } from '../../../../types'
import { getOwnerAndRepo } from '../../../../utils/helpers/github/shared'
import { getRepoFullNameFromUrl } from '../../../../utils/helpers/github/url'
import { trimNewLinesAndSpaces } from '../../../../utils/helpers/shared'
import Avatar from '../../../common/Avatar'
import cardStyles from '../../styles'
import BranchRow from './BranchRow'
import { getGithubURLPressHandler } from './helpers'
import rowStyles from './styles'

export interface IProps {
  branch?: string
  body: string
  isRead: boolean
  name: string
  ownerName: string
  repositoryName: string
  tagName: string
  type: IGitHubEventType
  url: string
}

export interface IState {}

const ReleaseRow: SFC<IProps> = ({
  body: _body,
  branch,
  isRead,
  name: _name,
  tagName: _tagName,
  type,
  url,
}) => {
  const body = trimNewLinesAndSpaces(_body)
  const name = trimNewLinesAndSpaces(_name)
  const tagName = trimNewLinesAndSpaces(_tagName)

  const { owner: ownerName, repo: repositoryName } = getOwnerAndRepo(
    getRepoFullNameFromUrl(url),
  )

  return (
    <View>
      {!!(branch && ownerName && repositoryName) && (
        <BranchRow
          key={`branch-row-${branch}`}
          branch={branch}
          ownerName={ownerName!}
          repositoryName={repositoryName!}
          type={type}
          isRead={isRead}
        />
      )}

      <View style={rowStyles.container}>
        <View style={cardStyles.leftColumn}>
          <Avatar username={ownerName} small style={cardStyles.avatar} />
        </View>

        <View style={cardStyles.rightColumn}>
          <TouchableOpacity
            onPress={getGithubURLPressHandler(url)}
            style={rowStyles.mainContentContainer}
          >
            <Text
              style={[cardStyles.normalText, isRead && cardStyles.mutedText]}
            >
              <Text
                numberOfLines={1}
                style={isRead ? cardStyles.mutedText : cardStyles.normalText}
              >
                <Icon name="tag" />{' '}
              </Text>
              {name || tagName}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={rowStyles.container}>
        <View style={cardStyles.leftColumn}>
          <Avatar username={ownerName} small style={cardStyles.avatar} />
        </View>

        <View style={cardStyles.rightColumn}>
          <TouchableOpacity
            onPress={getGithubURLPressHandler(url)}
            style={rowStyles.mainContentContainer}
          >
            <Text
              style={[cardStyles.normalText, isRead && cardStyles.mutedText]}
            >
              <Text
                numberOfLines={1}
                style={isRead ? cardStyles.mutedText : cardStyles.normalText}
              >
                <Icon name="megaphone" />{' '}
              </Text>
              {body}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ReleaseRow
