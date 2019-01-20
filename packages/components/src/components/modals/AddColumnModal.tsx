import { rgba } from 'polished'
import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import { useSpring } from 'react-spring/native-hooks'

import { AddColumnDetailsPayload, constants } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useHover } from '../../hooks/use-hover'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { defaultTheme } from '../../styles/utils'
import { contentPadding, radius } from '../../styles/variables'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { SpringAnimatedTouchableOpacity } from '../animated/spring/SpringAnimatedTouchableOpacity'
import { ColumnHeaderItem } from '../columns/ColumnHeaderItem'
import { ModalColumn } from '../columns/ModalColumn'
import { separatorSize } from '../common/Separator'
import { useColumnWidth } from '../context/ColumnWidthContext'
import { useTheme } from '../context/ThemeContext'

export interface AddColumnModalProps {
  showBackButton: boolean
}

const columnTypes: AddColumnDetailsPayload[] = [
  {
    name: 'Dashboard',
    icon: 'home',
    subscription: {
      type: 'activity',
      subtype: 'USER_RECEIVED_EVENTS',
    },
    paramList: ['username'],
  },
  {
    name: 'User',
    icon: 'person',
    subscription: {
      type: 'activity',
      subtype: 'USER_EVENTS',
    },
    paramList: ['username'],
  },
  {
    name: 'Notifications',
    icon: 'bell',
    subscription: {
      type: 'notifications',
      subtype: '',
    },
    paramList: ['all'],
  },
  {
    name: 'Organization',
    icon: 'organization',
    subscription: {
      type: 'activity',
      subtype: 'ORG_PUBLIC_EVENTS',
    },
    paramList: ['org'],
  },
  {
    name: 'Repository',
    icon: 'repo',
    subscription: {
      type: 'activity',
      subtype: 'REPO_EVENTS',
    },
    paramList: ['owner', 'repo'],
  },
]

function keyExtractor(columnType: AddColumnDetailsPayload) {
  return `add-column-button-${columnType.subscription.type}-${columnType
    .subscription.subtype || ''}`
}

function AddColumnModalItem({
  availableWidth,
  disabled,
  item,
}: {
  availableWidth: number
  disabled?: boolean
  item: AddColumnDetailsPayload
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
      native: true,
      backgroundColor:
        (isHovered || isPressing) && !disabled
          ? theme.backgroundColorLess08
          : rgba(theme.backgroundColor, 0),
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
      disabled={disabled}
      onPress={() =>
        pushModal({
          name: 'ADD_COLUMN_DETAILS',
          params: item,
        })
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
        backgroundColor: springAnimatedStyles.backgroundColor,
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
          iconName={item.icon}
          noPadding
          size={24}
          style={{ marginBottom: contentPadding / 2 }}
        />

        <SpringAnimatedText
          style={{
            color: springAnimatedTheme.foregroundColor,
          }}
        >
          {item.name}
        </SpringAnimatedText>
      </View>
    </SpringAnimatedTouchableOpacity>
  )
}

export function AddColumnModal(props: AddColumnModalProps) {
  const { showBackButton } = props

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const columnIds = useReduxState(selectors.columnIdsSelector)
  const columnWidth = useColumnWidth()

  const outerSpacing = (3 / 4) * contentPadding
  const availableWidth = columnWidth - separatorSize - 2 * outerSpacing

  const hasReachedColumnLimit = columnIds.length >= constants.COLUMNS_LIMIT

  return (
    <ModalColumn
      columnId="add-column-modal"
      iconName="plus"
      showBackButton={showBackButton}
      title="Add Column"
    >
      <View
        style={{
          flex: 1,
          padding: outerSpacing,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
          }}
        >
          {columnTypes.map(item => (
            <AddColumnModalItem
              key={keyExtractor(item)}
              availableWidth={availableWidth}
              disabled={hasReachedColumnLimit}
              item={item}
            />
          ))}

          {!!hasReachedColumnLimit && (
            <SpringAnimatedText
              style={{
                marginTop: contentPadding,
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
        </View>
      </View>
    </ModalColumn>
  )
}
