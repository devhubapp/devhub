import _ from 'lodash'
import React, { useCallback, useLayoutEffect, useRef } from 'react'
import { View, ViewStyle } from 'react-native'
import { useSpring } from 'react-spring/native'

import { constants, GitHubIcon } from '@devhub/core'
import { useHover } from '../../hooks/use-hover'
import { Platform } from '../../libs/platform'
import {
  columnHeaderItemContentSize,
  contentPadding,
} from '../../styles/variables'
import { getDefaultReactSpringAnimationConfig } from '../../utils/helpers/animations'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { AccordionView } from '../common/AccordionView'
import { ConditionalWrap } from '../common/ConditionalWrap'
import { Separator } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import {
  TouchableOpacity,
  TouchableOpacityProps,
} from '../common/TouchableOpacity'
import { useTheme } from '../context/ThemeContext'
import { ThemedText } from '../themed/ThemedText'
import { getColumnHeaderThemeColors } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'

export interface ColumnOptionsRowProps {
  analyticsLabel: TouchableOpacityProps['analyticsLabel']
  children: React.ReactNode
  containerStyle?: ViewStyle
  contentContainerStyle?: ViewStyle
  disableBackground?: boolean
  enableBackgroundHover?: boolean
  forceImmediate?: boolean
  hasChanged: boolean
  headerItemFixedIconSize?: number
  iconName: GitHubIcon
  isOpen: boolean
  onToggle: (() => void) | undefined
  openOnHover?: boolean
  right?: string | React.ReactNode
  title: string
}

export function ColumnOptionsRow(props: ColumnOptionsRowProps) {
  const {
    analyticsLabel,
    children,
    containerStyle,
    contentContainerStyle,
    enableBackgroundHover = true,
    hasChanged,
    headerItemFixedIconSize = columnHeaderItemContentSize,
    iconName,
    isOpen,
    onToggle,
    openOnHover,
    right: _right,
    title,
  } = props

  const subtitle = _right && typeof _right === 'string' ? _right : undefined
  const right = subtitle ? undefined : _right

  const theme = useTheme()

  const cacheRef = useRef({
    isHovered: false,
    isPressing: false,
  })

  const getStyles = useCallback(
    ({ forceImmediate }: { forceImmediate?: boolean } = {}) => {
      const { isHovered, isPressing } = cacheRef.current
      const immediate =
        constants.DISABLE_ANIMATIONS ||
        forceImmediate ||
        isHovered ||
        Platform.realOS !== 'web'

      return {
        config: getDefaultReactSpringAnimationConfig(),
        immediate,
        backgroundColor:
          enableBackgroundHover && (isHovered || isPressing || isOpen)
            ? theme[getColumnHeaderThemeColors(theme.backgroundColor).hover]
            : theme[getColumnHeaderThemeColors(theme.backgroundColor).normal],
      }
    },
    [enableBackgroundHover, isOpen, theme],
  )

  const updateStyles = useCallback(
    ({ forceImmediate }: { forceImmediate?: boolean }) => {
      setSpringAnimatedStyles(getStyles({ forceImmediate }))
    },
    [getStyles],
  )

  const touchableRef = useRef(null)
  const initialIsHovered = useHover(
    onToggle ? touchableRef : null,
    isHovered => {
      if (cacheRef.current.isHovered === isHovered) return
      cacheRef.current.isHovered = isHovered
      updateStyles({ forceImmediate: false })

      if (openOnHover && onToggle && !isOpen) onToggle()
    },
  )
  cacheRef.current.isHovered = initialIsHovered

  const [springAnimatedStyles, setSpringAnimatedStyles] = useSpring(getStyles)

  const isFirstRendeRef = useRef(true)
  useLayoutEffect(() => {
    if (isFirstRendeRef.current) {
      isFirstRendeRef.current = false
      return
    }

    updateStyles({ forceImmediate: true })
  }, [updateStyles])

  return (
    <SpringAnimatedView
      style={{
        backgroundColor: enableBackgroundHover
          ? springAnimatedStyles.backgroundColor
          : undefined,
        // borderWidth: 0,
        // borderColor: 'transparent',
        // borderBottomWidth: separatorSize,
        // borderBottomColor: theme.backgroundColorLess1,
      }}
    >
      <ConditionalWrap
        condition={!!onToggle}
        wrap={child =>
          onToggle ? (
            <TouchableOpacity
              ref={touchableRef}
              activeOpacity={1}
              analyticsAction={isOpen ? 'hide' : 'show'}
              analyticsCategory="option_row"
              analyticsLabel={analyticsLabel}
              onPress={() => {
                onToggle()
              }}
              onPressIn={() => {
                if (Platform.realOS === 'web') return

                cacheRef.current.isPressing = true
                updateStyles({ forceImmediate: false })
              }}
              onPressOut={() => {
                if (Platform.realOS === 'web') return

                cacheRef.current.isPressing = false
                updateStyles({ forceImmediate: false })
              }}
            >
              {child}
            </TouchableOpacity>
          ) : (
            <View>{child}</View>
          )
        }
      >
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              alignContent: 'center',
              padding: contentPadding,
            },
            !!isOpen && !onToggle && { paddingBottom: contentPadding / 2 },
            containerStyle,
          ]}
        >
          <ColumnHeaderItem
            analyticsLabel={undefined}
            fixedIconSize
            iconName={iconName}
            iconStyle={{ lineHeight: 22 }}
            noPadding
            selectable={false}
            size={headerItemFixedIconSize}
            tooltip={undefined}
          />

          <Spacer width={contentPadding / 2} />

          <ThemedText
            color="foregroundColor"
            numberOfLines={1}
            style={{ fontWeight: '500' }}
          >
            {title}
          </ThemedText>

          <Spacer flex={1} minWidth={contentPadding / 2} />

          {!!(subtitle || hasChanged) && (
            <ThemedText
              color={
                !subtitle && hasChanged
                  ? 'primaryBackgroundColor'
                  : 'foregroundColorMuted60'
              }
              numberOfLines={1}
              style={{ fontSize: subtitle ? 12 : 10 }}
            >
              {subtitle || '●'}
            </ThemedText>
          )}

          {right}

          {!!onToggle && (
            <>
              <Spacer width={contentPadding} />

              <ColumnHeaderItem
                analyticsLabel={undefined}
                iconName={isOpen ? 'chevron-up' : 'chevron-down'}
                iconStyle={{ lineHeight: undefined }}
                noPadding
                selectable={false}
                tooltip={undefined}
              />
            </>
          )}
        </View>
      </ConditionalWrap>

      <ConditionalWrap
        condition={!!onToggle}
        wrap={c => <AccordionView isOpen={isOpen}>{c}</AccordionView>}
      >
        <View
          style={[{ paddingBottom: contentPadding }, contentContainerStyle]}
        >
          {children}
        </View>

        <Separator horizontal />
      </ConditionalWrap>
    </SpringAnimatedView>
  )
}
