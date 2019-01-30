import React from 'react'

import { View } from 'react-native'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { SpringAnimatedIcon } from '../../../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../../../animated/spring/SpringAnimatedText'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { getBranchURL } from './helpers'
import { cardRowStyles } from './styles'

export interface BranchRowProps {
  branch: string
  isBranchMainEvent: boolean
  isRead: boolean
  ownerName: string
  repositoryName: string
  smallLeftColumn?: boolean
}

export interface BranchRowState {}

export const BranchRow = React.memo((props: BranchRowProps) => {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const {
    branch: _branch,
    isBranchMainEvent,
    isRead,
    ownerName,
    repositoryName,
    smallLeftColumn,
  } = props

  const branch = (_branch || '').replace('refs/heads/', '')
  if (!branch) return null

  if (branch === 'master' && !isBranchMainEvent) return null

  return (
    <View style={cardRowStyles.container}>
      <View
        style={[
          cardStyles.leftColumn,
          smallLeftColumn
            ? cardStyles.leftColumn__small
            : cardStyles.leftColumn__big,
        ]}
      >
        <Avatar
          isBot={Boolean(ownerName && ownerName.indexOf('[bot]') >= 0)}
          linkURL=""
          small
          style={cardStyles.avatar}
          username={ownerName}
        />
      </View>

      <View style={cardStyles.rightColumn}>
        <Link
          href={getBranchURL(ownerName, repositoryName, branch)}
          style={cardRowStyles.mainContentContainer}
        >
          <SpringAnimatedText
            numberOfLines={1}
            style={[
              getCardStylesForTheme(springAnimatedTheme).normalText,
              (isRead || !isBranchMainEvent) &&
                getCardStylesForTheme(springAnimatedTheme).mutedText,
            ]}
          >
            <SpringAnimatedIcon
              name="git-branch"
              size={13}
              style={[
                getCardStylesForTheme(springAnimatedTheme).normalText,
                getCardStylesForTheme(springAnimatedTheme).icon,
                isRead && getCardStylesForTheme(springAnimatedTheme).mutedText,
              ]}
            />{' '}
            {branch}
          </SpringAnimatedText>
        </Link>
      </View>
    </View>
  )
})
