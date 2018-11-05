import React, { PureComponent } from 'react'
import { ScrollView } from 'react-native'

import { contentPadding } from '../../styles/variables'
import { ModalColumn } from '../columns/ModalColumn'
import { ThemePreference } from '../widgets/ThemePreference'

export interface SettingsModalProps {}

export class SettingsModal extends PureComponent<SettingsModalProps> {
  render() {
    return (
      <ModalColumn iconName="gear" title="Preferences">
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: contentPadding }}
        >
          <ThemePreference />
        </ScrollView>
      </ModalColumn>
    )
  }
}
