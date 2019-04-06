import _ from 'lodash'
import React, { Fragment } from 'react'
import { ScrollView, View } from 'react-native'

export interface KeyboardShortcutsModalProps {
  showBackButton: boolean
}

import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { ModalColumn } from '../columns/ModalColumn'
import { H2 } from '../common/H2'
import { Label } from '../common/Label'
import { Spacer } from '../common/Spacer'
import { useTheme } from '../context/ThemeContext'

const keyboardShortcuts = [
  { keys: ['Esc'], description: 'Close currently open modal' },
  { keys: ['Esc'], description: 'Exit full screen mode on desktop' },
  { keys: ['Esc'], description: 'Unselect currently selected item' },
  { keys: ['n'], description: 'Add a new column' },
  { keys: ['p'], description: 'Open preferences' },
  { keys: ['1...9'], description: 'Go to the nth column' },
  { keys: ['0'], description: 'Go to the last column' },
  { keys: ['↑', '↓', 'j', 'k'], description: 'Move up/down inside a column' },
  {
    keys: ['←', '→', 'h', 'l'],
    description: 'Move left/right between columns',
  },
  { keys: ['r'], description: 'Mark item as read/unread' },
  { keys: ['s'], description: 'Toggle save item for later' },
  { keys: ['Alt ←', 'Alt →'], description: 'Move currently selected column' },
  { keys: ['Tab'], description: 'Navigate between buttons and links' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
]

export function KeyboardShortcutsModal(props: KeyboardShortcutsModalProps) {
  const { showBackButton } = props

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()
  const theme = useTheme()

  return (
    <ModalColumn
      iconName="keyboard"
      name="KEYBOARD_SHORTCUTS"
      showBackButton={showBackButton}
      title="Keyboard Shortcuts"
    >
      <ScrollView style={[sharedStyles.flex, { padding: contentPadding }]}>
        {keyboardShortcuts.map((ks, index) => (
          <Fragment key={[...ks.keys, index].join('+')}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 100 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}
                >
                  {ks.keys.map(key => (
                    <Label
                      key={`keyboard-shortcut-label-${index}-${key}`}
                      color={theme.backgroundColorLess2}
                      textColor={theme.foregroundColor}
                      containerStyle={{
                        alignSelf: 'flex-start',
                        marginBottom: contentPadding / 2,
                        marginRight: contentPadding / 2,
                      }}
                      small
                    >
                      <H2>{key}</H2>
                    </Label>
                  ))}
                </View>
              </View>

              <SpringAnimatedText
                style={{
                  marginBottom: contentPadding,
                  lineHeight: 16,
                  color: springAnimatedTheme.foregroundColor,
                }}
              >
                {ks.description}
              </SpringAnimatedText>
            </View>
            <Spacer height={contentPadding / 2} />
          </Fragment>
        ))}

        <Spacer height={contentPadding} />
      </ScrollView>
    </ModalColumn>
  )
}
