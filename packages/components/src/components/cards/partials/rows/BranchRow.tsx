import React from 'react'
import { View } from 'react-native'

import { getGitHubURLForBranch, Omit } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { smallAvatarSize } from '../../../../styles/variables'
import { SpringAnimatedIcon } from '../../../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../../../animated/spring/SpringAnimatedText'
import { Link } from '../../../common/Link'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { BaseRow, BaseRowProps } from './partials/BaseRow'
import { cardRowStyles } from './styles'

export interface BranchRowProps
  extends Omit<
    BaseRowProps,
    'containerStyle' | 'contentContainerStyle' | 'left' | 'right'
  > {
  branch: string
  isBranchMainEvent: boolean
  isRead: boolean
  ownerName: string
  repositoryName: string
}

export interface BranchRowState {}

export const BranchRow = React.memo((props: BranchRowProps) => {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const {
    branch,
    isBranchMainEvent,
    isRead,
    ownerName,
    repositoryName,
    ...otherProps
  } = props

  if (!branch) return null
  if (branch === 'master' && !isBranchMainEvent) return null

  const hideIcon = true
  const muted = isRead || !isBranchMainEvent // || branch === 'master'

  return (
    <BaseRow
      {...otherProps}
      left={
        // <Avatar
        //   isBot={Boolean(ownerName && ownerName.indexOf('[bot]') >= 0)}
        //   linkURL=""
        //   small
        //   style={cardStyles.avatar}
        //   username={ownerName}
        //   repo={repositoryName}
        // />
        <SpringAnimatedIcon
          name="git-branch"
          size={smallAvatarSize}
          style={[
            { alignSelf: 'flex-end' },
            getCardStylesForTheme(springAnimatedTheme).normalText,
            muted && getCardStylesForTheme(springAnimatedTheme).mutedText,
          ]}
        />
      }
      right={
        <View style={cardRowStyles.mainContentContainer}>
          <Link href={getGitHubURLForBranch(ownerName, repositoryName, branch)}>
            <SpringAnimatedText
              numberOfLines={1}
              style={[
                getCardStylesForTheme(springAnimatedTheme).normalText,
                cardStyles.smallText,
                muted && getCardStylesForTheme(springAnimatedTheme).mutedText,
              ]}
            >
              {!hideIcon && (
                <>
                  <SpringAnimatedIcon
                    name="git-branch"
                    size={13}
                    style={[
                      getCardStylesForTheme(springAnimatedTheme).normalText,
                      getCardStylesForTheme(springAnimatedTheme).icon,
                      isRead &&
                        getCardStylesForTheme(springAnimatedTheme).mutedText,
                    ]}
                  />{' '}
                </>
              )}
              {branch}
            </SpringAnimatedText>
          </Link>
        </View>
      }
    />
  )
})
