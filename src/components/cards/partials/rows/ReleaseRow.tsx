import React, { SFC } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Octicons'

import { IGitHubEventType } from '../../../../types'
import { trimNewLinesAndSpaces } from '../../../../utils/helpers/shared'
import Avatar from '../../../common/Avatar'
import cardStyles from '../../styles'
import BranchRow from './BranchRow'
import { getGithubURLPressHandler } from './helpers'
import rowStyles from './styles'

export interface IProps {
  avatarURL: string
  body: string
  branch?: string
  isRead: boolean
  name: string
  ownerName: string
  repositoryName: string
  tagName: string
  type: IGitHubEventType
  url: string
  userLinkURL: string
  username: string
}

export interface IState {}

const ReleaseRow: SFC<IProps> = ({
  avatarURL,
  body: _body,
  branch,
  isRead,
  name: _name,
  ownerName,
  repositoryName,
  tagName: _tagName,
  type,
  url,
  username,
  userLinkURL,
}) => {
  const body = trimNewLinesAndSpaces(_body)
  const name = trimNewLinesAndSpaces(_name)
  const tagName = trimNewLinesAndSpaces(_tagName)

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
          <Avatar
            isBot={Boolean(ownerName && ownerName.indexOf('[bot]') >= 0)}
            linkURL=""
            small
            style={cardStyles.avatar}
            username={ownerName}
          />
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
          <Avatar
            avatarURL={avatarURL}
            isBot={Boolean(username && username.indexOf('[bot]') >= 0)}
            linkURL={userLinkURL}
            small
            style={cardStyles.avatar}
            username={username}
          />
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
