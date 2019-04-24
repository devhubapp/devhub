import _ from 'lodash'
import React, { Fragment } from 'react'
import { ScrollView, View } from 'react-native'

export interface KeyboardShortcutsModalProps {
  showBackButton: boolean
}

import { sharedStyles } from '../../styles/shared'
import { contentPadding, smallTextSize } from '../../styles/variables'
import { ModalColumn } from '../columns/ModalColumn'
import { Spacer } from '../common/Spacer'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'

export const keyboardShortcutsById = {
  closeModal: { keys: ['Esc'], description: 'Close currently open modal' },
  goBack: { keys: ['Esc'], description: 'Go back to previous modal' },
  exitFullScreen: {
    keys: ['Esc'],
    description: 'Exit full screen mode on desktop',
  },
  unselectItem: {
    keys: ['Esc'],
    description: 'Unselect currently selected item',
  },
  addColumn: { keys: ['N'], description: 'Add a new column' },
  openPreferences: { keys: ['P'], description: 'Open preferences' },
  goToNthColumn: { keys: ['1...9'], description: 'Go to the nth column' },
  goToLastColumn: { keys: ['0'], description: 'Go to the last column' },
  selectPreviousItem: { keys: ['↑', 'J'], description: 'Select previous item' },
  selectNextItem: { keys: ['↓', 'K'], description: 'Select next item' },
  selectPreviousColumn: {
    keys: ['←', 'H'],
    description: 'Select previous column',
  },
  selectNextColumn: { keys: ['→', 'L'], description: 'Select next column' },
  toggleRead: { keys: ['R'], description: 'Mark item as read/unread' },
  toggleSave: { keys: ['S'], description: 'Toggle save item for later' },
  moveColumnLeft: { keys: ['Alt ←'], description: 'Move column to the left' },
  moveColumnRight: { keys: ['Alt →'], description: 'Move column to the right' },
  focusNextDom: {
    keys: ['Tab'],
    description: 'Navigate between buttons and links',
  },
  showKeyboardShortcuts: {
    keys: ['?'],
    description: 'Show keyboard shortcuts',
  },
}

export const keyboardShortcuts = [
  keyboardShortcutsById.closeModal,
  keyboardShortcutsById.exitFullScreen,
  keyboardShortcutsById.unselectItem,
  keyboardShortcutsById.addColumn,
  keyboardShortcutsById.openPreferences,
  keyboardShortcutsById.goToNthColumn,
  keyboardShortcutsById.goToLastColumn,
  keyboardShortcutsById.selectPreviousItem,
  keyboardShortcutsById.selectNextItem,
  keyboardShortcutsById.selectPreviousColumn,
  keyboardShortcutsById.selectNextColumn,
  keyboardShortcutsById.toggleRead,
  keyboardShortcutsById.toggleSave,
  keyboardShortcutsById.moveColumnLeft,
  keyboardShortcutsById.moveColumnRight,
  keyboardShortcutsById.focusNextDom,
  keyboardShortcutsById.showKeyboardShortcuts,
]

export function KeyboardShortcutsModal(props: KeyboardShortcutsModalProps) {
  const { showBackButton } = props

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
              <View style={{ width: 70 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}
                >
                  {ks.keys.map(key => (
                    <ThemedView
                      key={`keyboard-shortcut-label-${index}-${key}`}
                      backgroundColor="backgroundColorLess2"
                      style={{
                        alignSelf: 'flex-start',
                        marginBottom: contentPadding / 2,
                        marginRight: contentPadding / 2,
                        paddingVertical: contentPadding / 4,
                        paddingHorizontal: contentPadding / 2,
                        borderRadius: contentPadding,
                      }}
                    >
                      <ThemedText
                        color="foregroundColor"
                        style={{ fontSize: smallTextSize }}
                      >
                        {key}
                      </ThemedText>
                    </ThemedView>
                  ))}
                </View>
              </View>

              <ThemedText
                color="foregroundColor"
                style={{
                  marginBottom: contentPadding,
                  lineHeight: 16,
                }}
              >
                {ks.description}
              </ThemedText>
            </View>
            <Spacer height={contentPadding / 2} />
          </Fragment>
        ))}

        <Spacer height={contentPadding} />
      </ScrollView>
    </ModalColumn>
  )
}
