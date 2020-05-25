import React, { useCallback, useRef } from 'react'
import { View, ViewStyle } from 'react-native'

import { useDynamicRef } from '../../hooks/use-dynamic-ref'
import { useHover } from '../../hooks/use-hover'
import { Platform } from '../../libs/platform'
import { IconProp } from '../../libs/vector-icons'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
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
import {
  columnHeaderItemContentSize,
  getColumnHeaderThemeColors,
} from './ColumnHeader'

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
  icon: IconProp
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
    icon,
    isOpen,
    onToggle,
    openOnHover,
    right: _right,
    title,
  } = props

  const subtitle = _right && typeof _right === 'string' ? _right : undefined
  const right = subtitle ? undefined : _right

  const containerRef = useRef<View>(null)
  const innerRef = useRef<View>(null)
  const isOpenRef = useDynamicRef(isOpen)
  const isHoveredRef = useRef(false)
  const isPressingRef = useRef(false)

  const updateStyles = useCallback(() => {
    if (!innerRef.current) return

    const theme = getTheme()
    innerRef.current.setNativeProps({
      style: {
        backgroundColor:
          enableBackgroundHover &&
          !isOpenRef.current &&
          (isHoveredRef.current || isPressingRef.current)
            ? theme[getColumnHeaderThemeColors().hover]
            : 'transparent',
      },
    })
  }, [enableBackgroundHover])

  const initialIsHovered = useHover(onToggle ? innerRef : null, isHovered => {
    if (isHoveredRef.current === isHovered) return
    isHoveredRef.current = isHovered
    updateStyles()

    if (openOnHover && onToggle && !isOpenRef.current) onToggle()
  })
  isHoveredRef.current = initialIsHovered

  return (
    <ThemedView
      ref={containerRef}
      backgroundColor={
        enableBackgroundHover && isOpen
          ? getColumnHeaderThemeColors().hover
          : getColumnHeaderThemeColors().normal
      }
    >
      <ConditionalWrap
        condition={!!onToggle}
        wrap={child =>
          onToggle ? (
            <TouchableOpacity
              ref={innerRef as any}
              activeOpacity={1}
              analyticsAction={isOpen ? 'hide' : 'show'}
              analyticsCategory="option_row"
              analyticsLabel={analyticsLabel}
              onPress={() => {
                onToggle()
              }}
              onPressIn={() => {
                if (!Platform.supportsTouch) return
                isPressingRef.current = true
                updateStyles()
              }}
              onPressOut={() => {
                if (!Platform.supportsTouch) return
                isPressingRef.current = false
                updateStyles()
              }}
            >
              {child}
            </TouchableOpacity>
          ) : (
            <View ref={innerRef}>{child}</View>
          )
        }
      >
        <View
          style={[
            sharedStyles.horizontalAndVerticallyAligned,
            sharedStyles.paddingVertical,
            { paddingHorizontal: (contentPadding * 2) / 3 },
            !!isOpen && !onToggle && { paddingBottom: contentPadding / 2 },
            containerStyle,
          ]}
        >
          <ThemedIcon
            {...icon}
            color="foregroundColor"
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
                family="octicon"
                name={isOpen ? 'chevron-up' : 'chevron-down'}
                selectable={false}
                style={{
                  width: headerItemFixedIconSize,
                  fontSize: headerItemFixedIconSize,
                  textAlign: 'center',
                }}
              />

              <Spacer width={contentPadding / 3} />
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
