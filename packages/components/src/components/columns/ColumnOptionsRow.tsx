import React, { useCallback, useRef } from 'react'
import { View, ViewStyle } from 'react-native'

import { GitHubIcon } from '@devhub/core'
import { useDynamicRef } from '../../hooks/use-dynamic-ref'
import { useHover } from '../../hooks/use-hover'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import {
  columnHeaderItemContentSize,
  contentPadding,
} from '../../styles/variables'
import { AccordionView } from '../common/AccordionView'
import { ConditionalWrap } from '../common/ConditionalWrap'
import { Separator } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import {
  TouchableOpacity,
  TouchableOpacityProps,
} from '../common/TouchableOpacity'
import { getTheme } from '../context/ThemeContext'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'
import { getColumnHeaderThemeColors } from './ColumnHeader'

export interface ColumnOptionsRowProps {
  analyticsLabel?: TouchableOpacityProps['analyticsLabel']
  children: React.ReactNode
  containerStyle?: ViewStyle
  contentContainerStyle?: ViewStyle
  disableBackground?: boolean
  enableBackgroundHover?: boolean
  hasChanged: boolean
  headerItemFixedIconSize?: number
  hideSeparator?: boolean
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
    hideSeparator,
    iconName,
    isOpen,
    onToggle,
    openOnHover,
    right: _right,
    title,
  } = props

  const subtitle = _right && typeof _right === 'string' ? _right : undefined
  const right = subtitle ? undefined : _right

  const viewRef = useRef<View>(null)

  const isOpenRef = useDynamicRef(isOpen)

  const cacheRef = useRef({
    isHovered: false,
    isPressing: false,
  })

  const getBackgroundThemeColor = useCallback(() => {
    const { isHovered, isPressing } = cacheRef.current

    return enableBackgroundHover &&
      (isHovered || isPressing || isOpenRef.current)
      ? getColumnHeaderThemeColors().hover
      : getColumnHeaderThemeColors().normal
  }, [enableBackgroundHover])

  const getStyles = useCallback(() => {
    const theme = getTheme()

    return {
      backgroundColor: theme[getBackgroundThemeColor()],
    }
  }, [getBackgroundThemeColor])

  const updateStyles = useCallback(() => {
    if (!viewRef.current) return
    viewRef.current.setNativeProps({ style: getStyles() })
  }, [getStyles])

  const touchableRef = useRef(null)
  const initialIsHovered = useHover(
    onToggle ? touchableRef : null,
    isHovered => {
      if (cacheRef.current.isHovered === isHovered) return
      cacheRef.current.isHovered = isHovered
      updateStyles()

      if (openOnHover && onToggle && !isOpenRef.current) onToggle()
    },
  )
  cacheRef.current.isHovered = initialIsHovered

  return (
    <ThemedView ref={viewRef} backgroundColor={getBackgroundThemeColor()}>
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
                if (!Platform.supportsTouch) return

                cacheRef.current.isPressing = true
                updateStyles()
              }}
              onPressOut={() => {
                if (!Platform.supportsTouch) return

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
            sharedStyles.horizontalAndVerticallyAligned,
            sharedStyles.paddingVertical,
            sharedStyles.paddingHorizontalHalf,
            !!isOpen && !onToggle && { paddingBottom: contentPadding / 2 },
            containerStyle,
          ]}
        >
          <Spacer width={contentPadding / 3} />

          <ThemedIcon
            color="foregroundColor"
            name={iconName}
            selectable={false}
            style={{
              lineHeight: 22,
              width: headerItemFixedIconSize,
              fontSize: headerItemFixedIconSize,
              textAlign: 'center',
            }}
          />

          <Spacer width={contentPadding / 2} />

          {!!title && (
            <ThemedText
              color="foregroundColor"
              numberOfLines={1}
              style={{ fontWeight: '500' }}
            >
              {title}
            </ThemedText>
          )}

          <Spacer flex={1} minWidth={contentPadding / 2} />

          {!!(subtitle || hasChanged) && (
            <ThemedText
              color={
                !subtitle && hasChanged
                  ? 'primaryBackgroundColor'
                  : 'foregroundColorMuted65'
              }
              numberOfLines={1}
              style={{ fontSize: subtitle ? 12 : 10 }}
            >
              {subtitle || '●'}
            </ThemedText>
          )}

          {!!right && right}

          {!!onToggle && (
            <>
              <Spacer width={contentPadding} />

              <ThemedIcon
                color="foregroundColor"
                name={isOpen ? 'chevron-up' : 'chevron-down'}
                selectable={false}
                style={{
                  width: headerItemFixedIconSize,
                  fontSize: headerItemFixedIconSize,
                  textAlign: 'center',
                }}
              />

              <Spacer width={contentPadding / 2} />
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

        {!hideSeparator && <Separator horizontal />}
      </ConditionalWrap>
    </ThemedView>
  )
}
