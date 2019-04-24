import React from 'react'
import { View } from 'react-native'

import { AppViewMode } from '@devhub/core'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { Checkbox } from '../common/Checkbox'
import { SubHeader } from '../common/SubHeader'

export const AppViewModePreference = React.memo(() => {
  const currentAppViewMode = useReduxState(selectors.appViewModeSelector)
  const setAppViewMode = useReduxAction(actions.setAppViewMode)

  function renderOption(appViewMode: AppViewMode) {
    return (
      <Checkbox
        analyticsLabel={undefined}
        key={`app-layout-item-checkbox-${appViewMode}`}
        checked={currentAppViewMode === appViewMode}
        circle
        containerStyle={{
          marginBottom: contentPadding / 2,
        }}
        label={
          appViewMode === 'single-column'
            ? 'Single-column'
            : appViewMode === 'multi-column'
            ? 'Multi-column'
            : appViewMode
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
          <View style={sharedStyles.flex}>{renderOption('single-column')}</View>

          <View style={sharedStyles.flex}>{renderOption('multi-column')}</View>
        </View>
      </View>
    </View>
  )
})
