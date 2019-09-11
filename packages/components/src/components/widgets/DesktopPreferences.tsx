import React, { useEffect, useState } from 'react'
import { View } from 'react-native'

import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { H3 } from '../common/H3'
import { SubHeader } from '../common/SubHeader'
import { Switch } from '../common/Switch'

export const DesktopPreferences = React.memo(() => {
  const [{ isMenuBarMode }, setState] = useState<{
    isMenuBarMode: boolean
    lockOnCenter: boolean
    openAtLogin: boolean
  }>(() => window.ipc.sendSync('get-all-settings') || {})

  useEffect(() => {
    window.ipc.on(
      'update-settings',
      (e: any, payload?: { settings: string; value: boolean }) => {
        if (!(payload && payload.settings)) return
        setState(state => ({ ...state, [payload.settings]: payload.value }))
      },
    )
  }, [])

  if (!Platform.isElectron) return null

  return (
    <View>
      <SubHeader title="Desktop options" />

      <View style={{ paddingHorizontal: contentPadding }}>
        <View
          style={[
            sharedStyles.horizontal,
            sharedStyles.alignItemsCenter,
            sharedStyles.justifyContentSpaceBetween,
          ]}
        >
          <H3>Menubar mode</H3>
          <Switch
            analyticsLabel="menubar_mode"
            onValueChange={value =>
              window.ipc.send('update-settings', {
                settings: 'isMenuBarMode',
                value,
              })
            }
            value={isMenuBarMode}
          />
        </View>
      </View>
    </View>
  )
})

DesktopPreferences.displayName = 'DesktopPreferences'
