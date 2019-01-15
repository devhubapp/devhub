import _ from 'lodash'
import React from 'react'
import { View, ViewStyle } from 'react-native'

import { GitHubIcon } from '@devhub/core'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import * as colors from '../../styles/colors'
import {
  columnHeaderItemContentSize,
  contentPadding,
} from '../../styles/variables'
import { AnimatedText } from '../animated/AnimatedText'
import { AccordionView } from '../common/AccordionView'
import { Spacer } from '../common/Spacer'
import {
  TouchableOpacity,
  TouchableOpacityProps,
} from '../common/TouchableOpacity'
import { ColumnHeaderItem } from './ColumnHeaderItem'

export interface ColumnOptionsRowProps {
  analyticsLabel: TouchableOpacityProps['analyticsLabel']
  children: React.ReactNode
  containerStyle?: ViewStyle
  contentContainerStyle?: ViewStyle
  hasChanged: boolean
  iconName: GitHubIcon
  onToggle: () => void
  opened: boolean
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
    onToggle,
    opened,
    subtitle,
    title,
  } = props

  const theme = useAnimatedTheme()

  return (
    <>
      <TouchableOpacity
        analyticsAction={opened ? 'hide' : 'show'}
        analyticsCategory="option_row"
        analyticsLabel={analyticsLabel}
        onPress={() => onToggle()}
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

          <AnimatedText
            numberOfLines={1}
            style={{ color: theme.foregroundColor }}
          >
            {title}
          </AnimatedText>

          <Spacer flex={1} minWidth={contentPadding / 2} />

          {!!(subtitle || hasChanged) && (
            <AnimatedText
              numberOfLines={1}
              style={{
                fontSize: 12,
                color: hasChanged
                  ? colors.brandBackgroundColor
                  : theme.foregroundColorMuted50,
              }}
            >
              {subtitle || '●'}
            </AnimatedText>
          )}

          <Spacer width={contentPadding} />

          <ColumnHeaderItem
            analyticsLabel={undefined}
            iconName={opened ? 'chevron-up' : 'chevron-down'}
            iconStyle={{ lineHeight: undefined }}
            noPadding
            selectable={false}
          />
        </View>
      </TouchableOpacity>

      <AccordionView property="height">
        {!!opened && (
          <View
            style={[
              {
                paddingLeft: columnHeaderItemContentSize + 1.5 * contentPadding,
                paddingBottom: contentPadding / 2,
              },
              contentContainerStyle,
            ]}
          >
            {children}
          </View>
        )}
      </AccordionView>
    </>
  )
}
