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
import { Browser } from '../../libs/browser'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { contentPadding, radius } from '../../styles/variables'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { SpringAnimatedTouchableOpacity } from '../animated/spring/SpringAnimatedTouchableOpacity'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { ModalColumn } from '../columns/ModalColumn'
import { fabSize } from '../common/FAB'
import { H2 } from '../common/H2'
import { HeaderMessage } from '../common/HeaderMessage'
import { Link } from '../common/Link'
import { separatorTickSize } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import { SubHeader } from '../common/SubHeader'
import { useColumnWidth } from '../context/ColumnWidthContext'
import { useAppLayout } from '../context/LayoutContext'
import { useTheme } from '../context/ThemeContext'
import { fabSpacing } from '../layout/FABRenderer'

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
        },
      },
    ],
  },
  {
    title: 'Activity',
    type: 'activity',
    icon: 'note',
    items: [
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
        },
      },
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
        },
      },
    ],
  },
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
]

function AddColumnModalItem({
  availableWidth,
  disabled,
  icon,
  payload,
  title,
}: {
  availableWidth: number
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

  useEffect(
    () => {
      updateStyles()
    },
    [disabled],
  )

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const pushModal = useReduxAction(actions.pushModal)

  function getStyles() {
    const { isHovered, isPressing, theme } = cacheRef.current

    return {
      config: { duration: 100 },
      backgroundColor:
        (isHovered || isPressing) && !disabled
          ? theme.backgroundColorLess1
          : rgba(theme.backgroundColor, 0),
      borderColor: theme.backgroundColorLess1,
    }
  }

  function updateStyles() {
    setSpringAnimatedStyles(getStyles())
  }

  if (!(availableWidth > 0)) return null

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
        width:
          availableWidth / Math.floor(availableWidth / (82 + contentPadding)),
        borderRadius: radius,
        borderWidth: 0,
        ...springAnimatedStyles,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: contentPadding / 4,
          paddingVertical: contentPadding,
        }}
      >
        <ColumnHeaderItem
          analyticsLabel={undefined}
          iconName={icon}
          iconStyle={{ lineHeight: undefined }}
          noPadding
          size={24}
          style={{ alignSelf: 'center', marginBottom: contentPadding / 2 }}
        />

        <SpringAnimatedText
          style={{
            color: springAnimatedTheme.foregroundColor,
            textAlign: 'center',
          }}
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
  const username = useReduxState(selectors.currentUsernameSelector)
  const installationOwnerNames = useReduxState(
    selectors.installationOwnerNamesSelector,
  )

  const columnWidth = useColumnWidth()
  const { sizename } = useAppLayout()

  const outerSpacing = (3 / 4) * contentPadding
  const availableWidth = columnWidth - 2 * separatorTickSize - 2 * outerSpacing

  const hasReachedColumnLimit = columnIds.length >= constants.COLUMNS_LIMIT

  const isFabVisible = sizename < '3-large'

  return (
    <ModalColumn
      iconName="plus"
      name="ADD_COLUMN"
      showBackButton={showBackButton}
      title="Add Column"
    >
      {!(
        installationOwnerNames &&
        installationOwnerNames.length &&
        username !== 'appledevhub'
      ) && (
        <HeaderMessage>
          <Link
            analyticsLabel="new-feature-private-repository-support"
            href={`${constants.API_BASE_URL}/github/private-repository-support`}
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
              New: Private repositories support!
            </SpringAnimatedText>
          </Link>
        </HeaderMessage>
      )}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
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
                    style={{ flex: 1 }}
                  />
                </Link>
              )}
            </SubHeader>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignContent: 'flex-start',
                paddingHorizontal: outerSpacing,
                marginBottom: outerSpacing,
              }}
            >
              {group.items.map((item, itemIndex) => (
                <AddColumnModalItem
                  key={`add-column-button-group-${groupIndex}-item-${itemIndex}`}
                  availableWidth={availableWidth}
                  disabled={hasReachedColumnLimit || !item.payload}
                  icon={item.icon}
                  payload={item.payload}
                  title={item.title}
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
