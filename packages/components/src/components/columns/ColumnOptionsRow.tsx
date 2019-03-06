import _ from 'lodash'
import React, { useEffect, useRef } from 'react'
import { View, ViewStyle } from 'react-native'
import { useSpring } from 'react-spring/native'

import { GitHubIcon } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useHover } from '../../hooks/use-hover'
import { Platform } from '../../libs/platform'
import {
  columnHeaderItemContentSize,
  contentPadding,
} from '../../styles/variables'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { AccordionView } from '../common/AccordionView'
import { ConditionalWrap } from '../common/ConditionalWrap'
import { separatorSize } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import {
  TouchableOpacity,
  TouchableOpacityProps,
} from '../common/TouchableOpacity'
import { useTheme } from '../context/ThemeContext'
import { getColumnHeaderThemeColors } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'

export interface ColumnOptionsRowProps {
  analyticsLabel: TouchableOpacityProps['analyticsLabel']
  children: React.ReactNode
  containerStyle?: ViewStyle
  contentContainerStyle?: ViewStyle
  hasChanged: boolean
  iconName: GitHubIcon
  onToggle: (() => void) | undefined
  openOnHover?: boolean
  isOpen: boolean
  subtitle?: string
  title: string
}

export function ColumnOptionsRow(props: ColumnOptionsRowProps) {
  const {
    analyticsLabel,
    children,
    containerStyle,
    contentContainerStyle,
    hasChanged,
    iconName,
    isOpen,
    onToggle,
    openOnHover,
    subtitle,
    title,
  } = props

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const initialTheme = useTheme(theme => {
    cacheRef.current.theme = theme
    updateStyles()
  })

  const touchableRef = useRef(null)
  const initialIsHovered = useHover(
    onToggle ? touchableRef : null,
    isHovered => {
      cacheRef.current.isHovered = isHovered
      updateStyles()

      if (openOnHover && onToggle && !isOpen) onToggle()
    },
  )

  const cacheRef = useRef({
    isHovered: initialIsHovered,
    isPressing: false,
    theme: initialTheme,
  })

  const [springAnimatedStyles, setSpringAnimatedStyles] = useSpring(getStyles)

  useEffect(() => {
    updateStyles()
  }, [isOpen])

  function getStyles() {
    const { isHovered, isPressing, theme } = cacheRef.current

    return {
      config: { duration: 100 },
      backgroundColor:
        isHovered || isPressing || isOpen
          ? theme[getColumnHeaderThemeColors(theme.backgroundColor).hover]
          : theme[getColumnHeaderThemeColors(theme.backgroundColor).normal],
    }
  }

  function updateStyles() {
    setSpringAnimatedStyles(getStyles())
  }

  return (
    <SpringAnimatedView
      style={{
        backgroundColor: springAnimatedStyles.backgroundColor,
        borderWidth: 0,
        borderColor: 'transparent',
        borderBottomWidth: separatorSize,
        borderBottomColor: springAnimatedTheme.backgroundColorLess1,
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
                updateStyles()
              }}
              onPressOut={() => {
                if (Platform.realOS === 'web') return

                cacheRef.current.isPressing = false
                updateStyles()
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
          />

          <Spacer width={contentPadding / 2} />

          <SpringAnimatedText
            numberOfLines={1}
            style={{ color: springAnimatedTheme.foregroundColor }}
          >
            {title}
          </SpringAnimatedText>

          <Spacer flex={1} minWidth={contentPadding / 2} />

          {!!(subtitle || hasChanged) && (
            <SpringAnimatedText
              numberOfLines={1}
              style={{
                fontSize: 12,
                color: hasChanged
                  ? springAnimatedTheme.primaryBackgroundColor
                  : springAnimatedTheme.foregroundColorMuted50,
              }}
            >
              {subtitle || '●'}
            </SpringAnimatedText>
          )}

          {!!onToggle && (
            <>
              <Spacer width={contentPadding} />

              <ColumnHeaderItem
                analyticsLabel={undefined}
                iconName={isOpen ? 'chevron-up' : 'chevron-down'}
                iconStyle={{ lineHeight: undefined }}
                noPadding
                selectable={false}
              />
            </>
          )}
        </View>
      </ConditionalWrap>

      <AccordionView isOpen={isOpen}>
        <View
          style={[
            {
              paddingBottom: contentPadding,
              paddingLeft: columnHeaderItemContentSize + 1.5 * contentPadding,
              paddingRight: contentPadding,
            },
            contentContainerStyle,
          ]}
        >
          {children}
        </View>
      </AccordionView>
    </SpringAnimatedView>
  )
}
