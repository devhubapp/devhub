import React from 'react'
import { View } from 'react-native'

import { AppViewMode } from '@devhub/core'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { SpringAnimatedCheckbox } from '../common/Checkbox'
import { SubHeader } from '../common/SubHeader'

export const AppViewModePreference = React.memo(() => {
  const currentAppViewMode = useReduxState(selectors.appViewModeSelector)
  const setAppViewMode = useReduxAction(actions.setAppViewMode)

  function renderOption(appViewMode: AppViewMode) {
    return (
      <SpringAnimatedCheckbox
        analyticsLabel={undefined}
        key={`app-layout-item-checkbox-${appViewMode}`}
        checked={currentAppViewMode === appViewMode}
        circle
        containerStyle={{
          marginBottom: contentPadding / 2,
        }}
        label={
          appViewMode === 'single-column' ? 'Single-column' : 'Multi-column'
        }
        onChange={checked => {
          if (checked) setAppViewMode(appViewMode)
        }}
      />
    )
  }

  return (
    <View>
      <SubHeader title="Layout mode" />

      <View style={{ paddingHorizontal: contentPadding }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            {/* <H3 withMargin>Single-column</H3> */}
            {renderOption('single-column')}
          </View>

          <View style={{ flex: 1 }}>
            {/* <H3 withMargin>Multi-column</H3> */}
            {renderOption('multi-column')}
          </View>
        </View>
      </View>
    </View>
  )
})
