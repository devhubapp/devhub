import { rgba } from 'polished'
import React, { useEffect, useRef } from 'react'
import { ScrollView, View } from 'react-native'
import { useSpring } from 'react-spring/native'

import {
  AddColumnDetailsPayload,
  ColumnSubscription,
  constants,
  GitHubIcon,
} from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useHover } from '../../hooks/use-hover'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { getGitHubAppInstallUri } from '../../utils/helpers/shared'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { SpringAnimatedTouchableOpacity } from '../animated/spring/SpringAnimatedTouchableOpacity'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { ModalColumn } from '../columns/ModalColumn'
import { fabSize } from '../common/FAB'
import { H2 } from '../common/H2'
import { HeaderMessage } from '../common/HeaderMessage'
import { Link } from '../common/Link'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { useAppLayout } from '../context/LayoutContext'
import { useTheme } from '../context/ThemeContext'
import { fabSpacing, shouldRenderFAB } from '../layout/FABRenderer'

export interface AddColumnModalProps {
  showBackButton: boolean
}

const columnTypes: Array<{
  title: string
  type: ColumnSubscription['type']
  icon: GitHubIcon
  items: Array<{
    title: string
    icon: GitHubIcon
    payload: AddColumnDetailsPayload | null
  }>
  soon?: boolean
  soonLink?: string
}> = [
  {
    title: 'Notifications',
    type: 'notifications',
    icon: 'bell',
    items: [
      {
        title: 'Notifications',
        icon: 'bell',
        payload: {
          icon: 'bell',
          title: 'All notifications',
          subscription: {
            type: 'notifications',
            subtype: undefined,
          },
          paramList: ['all'],
          isPrivateSupported: true,
        },
      },
      {
        title: 'Repository',
        icon: 'repo',
        payload: {
          icon: 'bell',
          title: 'Repository notifications',
          subscription: {
            type: 'notifications',
            subtype: 'REPO_NOTIFICATIONS',
          },
          paramList: ['all', 'owner', 'repo'],
          isPrivateSupported: true,
        },
      },
    ],
  },
  {
    title: 'Activities',
    type: 'activity',
    icon: 'note',
    items: [
      {
        title: 'User',
        icon: 'person',
        payload: {
          icon: 'person',
          title: 'User activity',
          subscription: {
            type: 'activity',
            subtype: 'USER_EVENTS',
          },
          paramList: ['username'],
          isPrivateSupported: false,
        },
      },
      {
        title: 'Dashboard',
        icon: 'home',
        payload: {
          icon: 'home',
          title: 'User dashboard',
          subscription: {
            type: 'activity',
            subtype: 'USER_RECEIVED_EVENTS',
          },
          paramList: ['username'],
          isPrivateSupported: false,
        },
      },
      {
        title: 'Repository',
        icon: 'repo',
        payload: {
          icon: 'repo',
          title: 'Repository activity',
          subscription: {
            type: 'activity',
            subtype: 'REPO_EVENTS',
          },
          paramList: ['owner', 'repo'],
          isPrivateSupported: true,
        },
      },
      {
        title: 'Organization',
        icon: 'organization',
        payload: {
          icon: 'organization',
          title: 'Organization activity',
          subscription: {
            type: 'activity',
            subtype: 'ORG_PUBLIC_EVENTS',
          },
          paramList: ['org'],
          isPrivateSupported: false,
        },
      },
    ],
  },
  /*
  {
    soon: true,
    soonLink: 'https://github.com/devhubapp/devhub/issues/110',
    title: 'Issue & PR Management',
    type: 'activity', // TODO
    icon: 'issue-opened',
    items: [
      {
        title: 'Issues',
        icon: 'issue-opened',
        payload: null,
      },
      {
        title: 'Pull Requests',
        icon: 'git-pull-request',
        payload: null,
      },
    ],
  },
  */
]

function AddColumnModalItem({
  disabled,
  icon,
  payload,
  title,
}: {
  disabled?: boolean
  icon: GitHubIcon
  payload: AddColumnDetailsPayload | null
  title: string
}) {
  const initialTheme = useTheme(theme => {
    cacheRef.current.theme = theme
    updateStyles()
  })

  const touchableRef = useRef(null)
  const initialIsHovered = useHover(touchableRef, isHovered => {
    cacheRef.current.isHovered = isHovered
    updateStyles()
  })

  const cacheRef = useRef({
    isHovered: initialIsHovered,
    isPressing: false,
    theme: initialTheme,
  })

  const [springAnimatedStyles, setSpringAnimatedStyles] = useSpring(getStyles)

  useEffect(() => {
    updateStyles()
  }, [disabled])

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const pushModal = useReduxAction(actions.pushModal)

  function getStyles() {
    const { isHovered, isPressing, theme } = cacheRef.current
    const immediate = isHovered || Platform.realOS === 'android'

    return {
      config: { duration: immediate ? 0 : 100 },
      immediate,
      backgroundColor:
        (isHovered || isPressing) && !disabled
          ? theme.backgroundColorLess1
          : rgba(theme.backgroundColor, 0),
    }
  }

  function updateStyles() {
    setSpringAnimatedStyles(getStyles())
  }

  return (
    <SpringAnimatedTouchableOpacity
      ref={touchableRef}
      analyticsLabel={undefined}
      disabled={disabled || !payload}
      onPress={
        payload
          ? () =>
              pushModal({
                name: 'ADD_COLUMN_DETAILS',
                params: payload,
              })
          : undefined
      }
      onPressIn={() => {
        if (Platform.realOS === 'web') return

        cacheRef.current.isPressing = true
        updateStyles()
      }}
      onPressOut={() => {
        if (Platform.realOS === 'web') return

        cacheRef.current.isPressing = false
        updateStyles()
      }}
      style={{
        flex: 1,
        ...springAnimatedStyles,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: contentPadding,
        }}
      >
        <ColumnHeaderItem
          analyticsLabel={undefined}
          fixedIconSize
          iconName={icon}
          iconStyle={{ lineHeight: undefined }}
          noPadding
          size={16}
        />

        <Spacer width={contentPadding} />

        <SpringAnimatedText
          style={{ color: springAnimatedTheme.foregroundColor }}
        >
          {title}
        </SpringAnimatedText>
      </View>
    </SpringAnimatedTouchableOpacity>
  )
}

export function AddColumnModal(props: AddColumnModalProps) {
  const { showBackButton } = props

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const columnIds = useReduxState(selectors.columnIdsSelector)
  const username = useReduxState(selectors.currentGitHubUsernameSelector)
  const installationOwnerNames = useReduxState(
    selectors.installationOwnerNamesSelector,
  )

  const { sizename } = useAppLayout()

  const hasReachedColumnLimit = columnIds.length >= constants.COLUMNS_LIMIT

  const isFabVisible = shouldRenderFAB(sizename)

  return (
    <ModalColumn
      iconName="plus"
      name="ADD_COLUMN"
      showBackButton={showBackButton}
      title="Add Column"
    >
      {!(installationOwnerNames && installationOwnerNames.length) &&
        username !== 'appledevhub' && (
          <HeaderMessage>
            <Link
              analyticsLabel="install-github-app-to-unlock-private-repository-support"
              href={getGitHubAppInstallUri()}
              openOnNewTab
            >
              <SpringAnimatedText
                style={{
                  flexGrow: 1,
                  lineHeight: 14,
                  fontSize: 11,
                  textAlign: 'center',
                  color: springAnimatedTheme.foregroundColorMuted50,
                }}
              >
                ✨ Install the GitHub App to unlock Private Repositories
              </SpringAnimatedText>
            </Link>
          </HeaderMessage>
        )}

      <ScrollView
        style={sharedStyles.flex}
        contentContainerStyle={sharedStyles.flexGrow}
      >
        {columnTypes.map((group, groupIndex) => (
          <View key={`add-column-header-group-${groupIndex}`}>
            <SubHeader muted={group.soon} title={group.title}>
              {!!group.soon && (
                <Link
                  analyticsLabel={`add-column-${group.title}-soon`}
                  href={group.soonLink}
                >
                  <H2
                    muted
                    withMargin={false}
                    children=" (soon)"
                    style={sharedStyles.flex}
                  />
                </Link>
              )}
            </SubHeader>

            <View style={{ marginBottom: contentPadding }}>
              {group.items.map((item, itemIndex) => (
                <AddColumnModalItem
                  key={`add-column-button-group-${groupIndex}-item-${itemIndex}`}
                  disabled={hasReachedColumnLimit || !item.payload}
                  icon={item.icon}
                  payload={item.payload}
                  title={(item.payload && item.payload.title) || item.title}
                />
              ))}
            </View>
          </View>
        ))}

        {!!hasReachedColumnLimit && (
          <SpringAnimatedText
            style={{
              marginTop: contentPadding,
              paddingHorizontal: contentPadding,
              lineHeight: 20,
              fontSize: 14,
              color: springAnimatedTheme.foregroundColorMuted50,
              textAlign: 'center',
            }}
          >
            {`You have reached the limit of ${
              constants.COLUMNS_LIMIT
            } columns. This is to maintain a healthy usage of the GitHub API.`}
          </SpringAnimatedText>
        )}

        <Spacer flex={1} minHeight={contentPadding} />

        <Spacer
          height={isFabVisible ? fabSize + 2 * fabSpacing : contentPadding}
        />
      </ScrollView>
    </ModalColumn>
  )
}
