import React from 'react'
import { Platform } from 'react-native'
import { withTheme } from 'styled-components/native'

import ActionSheet from '../libs/actionsheet'
import { columnMargin } from './columns/_Column'

import { radius } from '../styles/variables'

const StyledActionSheet = withTheme(
  ({ innerRef, buttonContainerStyle, theme, ...props }) => (
    <ActionSheet
      ref={innerRef}
      containerPadding={columnMargin}
      buttonContainerStyle={[
        { backgroundColor: theme.base02 },
        buttonContainerStyle,
      ]}
      buttonsContainerStyle={[
        { backgroundColor: theme.base01 },
        buttonContainerStyle,
      ]}
      radius={radius}
      tintColor={
        !theme.isDark && Platform.OS === 'ios' ? undefined : theme.base04
      }
      titleTextStyle={{ color: theme.brand }}
      subtitleText={{ color: theme.base05 }}
      {...props}
    />
  ),
)

StyledActionSheet.propTypes = ActionSheet.propTypes

export default StyledActionSheet
