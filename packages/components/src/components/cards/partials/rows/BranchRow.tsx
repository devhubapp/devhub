import React from 'react'
import { View } from 'react-native'

import { useAnimatedTheme } from '../../../../hooks/use-animated-theme'
import { AnimatedIcon } from '../../../animated/AnimatedIcon'
import { AnimatedText } from '../../../animated/AnimatedText'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { getCardStylesForTheme } from '../../styles'
import { getBranchURL } from './helpers'
import { getCardRowStylesForTheme } from './styles'

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
  const theme = useAnimatedTheme()

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
    <View style={getCardRowStylesForTheme(theme).container}>
      <View
        style={[
          getCardStylesForTheme(theme).leftColumn,
          smallLeftColumn
            ? getCardStylesForTheme(theme).leftColumn__small
            : getCardStylesForTheme(theme).leftColumn__big,
        ]}
      >
        <Avatar
          isBot={Boolean(ownerName && ownerName.indexOf('[bot]') >= 0)}
          linkURL=""
          small
          style={getCardStylesForTheme(theme).avatar}
          username={ownerName}
        />
      </View>

      <View style={getCardStylesForTheme(theme).rightColumn}>
        <Link
          href={getBranchURL(ownerName, repositoryName, branch)}
          style={getCardRowStylesForTheme(theme).mainContentContainer}
        >
          <AnimatedText
            numberOfLines={1}
            style={[
              getCardStylesForTheme(theme).normalText,
              (isRead || !isBranchMainEvent) &&
                getCardStylesForTheme(theme).mutedText,
            ]}
          >
            <AnimatedIcon
              name="git-branch"
              style={[
                getCardStylesForTheme(theme).normalText,
                isRead && getCardStylesForTheme(theme).mutedText,
              ]}
            />{' '}
            {branch}
          </AnimatedText>
        </Link>
      </View>
    </View>
  )
})
