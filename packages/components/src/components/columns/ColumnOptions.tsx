import React from 'react'

import { Column, getColumnOption } from '@devhub/core'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useColumn } from '../../hooks/use-column'
import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding, smallerTextSize } from '../../styles/variables'
import { Checkbox, defaultCheckboxSize } from '../common/Checkbox'
import { IconButton } from '../common/IconButton'
import { Link } from '../common/Link'
import { Separator } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import { useAppLayout } from '../context/LayoutContext'
import { keyboardShortcutsById } from '../modals/KeyboardShortcutsModal'
import { ThemedView } from '../themed/ThemedView'
import { sharedColumnOptionsStyles } from './options/shared'

export interface ColumnOptionsProps {
  columnId: Column['id']
  isOpen?: boolean
}

export type ColumnOptionCategory = 'badge'

export const ColumnOptions = React.memo<ColumnOptionsProps>(props => {
  const { columnId } = props

  const dispatch = useDispatch()
  const columnsCount = useReduxState(selectors.columnCountSelector)

  const { appOrientation } = useAppLayout()
  const { appViewMode } = useAppViewMode()
  const { column, columnIndex } = useColumn(columnId)

  if (!column) return null

  return (
    <ThemedView
      backgroundColor="backgroundColorDarker1"
      style={sharedStyles.fullWidth}
    >
      <Spacer height={contentPadding} />

      <Checkbox
        analyticsLabel="column_option_in_app_unread_indicator"
        checked={getColumnOption(
          column,
          'enableInAppUnreadIndicator',
          Platform.OS,
        )}
        containerStyle={
          sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
        }
        defaultValue
        squareContainerStyle={sharedColumnOptionsStyles.checkboxSquareContainer}
        enableIndeterminateState={false}
        label={`Show unread indicator at ${
          appOrientation === 'portrait' ? 'bottom bar' : 'sidebar'
        }`}
        onChange={value => {
          dispatch(
            actions.setColumnOption({
              columnId,
              option: 'enableInAppUnreadIndicator',
              value,
            }),
          )
        }}
      />

      {Platform.OS === 'web' && (
        <Checkbox
          analyticsLabel="column_option_app_icon_unread_indicator"
          checked={getColumnOption(
            column,
            'enableAppIconUnreadIndicator',
            Platform.OS,
          )}
          containerStyle={
            sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
          }
          defaultValue={column.type === 'notifications'}
          squareContainerStyle={
            sharedColumnOptionsStyles.checkboxSquareContainer
          }
          enableIndeterminateState={false}
          label={`Show unread counter on ${
            Platform.OS === 'web' && !Platform.isElectron
              ? 'page title'
              : 'app icon'
          }`}
          onChange={value => {
            dispatch(
              actions.setColumnOption({
                columnId,
                option: 'enableAppIconUnreadIndicator',
                value,
              }),
            )
          }}
        />
      )}

      <Link
        analyticsLabel="column_option_mobile_push_notifications_soon_link"
        openOnNewTab
        href="https://github.com/devhubapp/devhub/issues/51"
      >
        <Checkbox
          analyticsLabel="column_option_mobile_push_notification"
          checked={false}
          containerStyle={
            sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
          }
          defaultValue={false}
          disabled
          enableIndeterminateState={false}
          label="Mobile push notifications"
          onChange={undefined}
          right="SOON"
          squareContainerStyle={
            sharedColumnOptionsStyles.checkboxSquareContainer
          }
        />
      </Link>

      <View
        style={[
          sharedStyles.horizontal,
          sharedStyles.paddingVertical,
          sharedStyles.paddingHorizontalHalf,
        ]}
      >
        <IconButton
          key="column-options-button-move-column-left"
          analyticsLabel="move_column_left"
          disabled={columnIndex === 0}
          name="chevron-left"
          onPress={() =>
            dispatch(
              actions.moveColumn({
                animated: appViewMode === 'multi-column',
                columnId,
                columnIndex: columnIndex - 1,
                highlight: appViewMode === 'multi-column' || columnIndex === 0,
                scrollTo: true,
              }),
            )
          }
          style={{ opacity: columnIndex === 0 ? 0.5 : 1 }}
          tooltip={`Move column left (${
            keyboardShortcutsById.moveColumnLeft.keys[0]
          })`}
        />

        <IconButton
          key="column-options-button-move-column-right"
          analyticsLabel="move_column_right"
          disabled={columnIndex === columnsCount - 1}
          name="chevron-right"
          onPress={() =>
            dispatch(
              actions.moveColumn({
                animated: appViewMode === 'multi-column',
                columnId,
                columnIndex: columnIndex + 1,
                highlight:
                  appViewMode === 'multi-column' ||
                  columnIndex === columnsCount - 1,
                scrollTo: true,
              }),
            )
          }
          style={{
            opacity: columnIndex === columnsCount - 1 ? 0.5 : 1,
          }}
          tooltip={`Move column right (${
            keyboardShortcutsById.moveColumnRight.keys[0]
          })`}
        />

        <Spacer flex={1} />

        <IconButton
          key="column-options-button-remove-column"
          analyticsLabel="remove_column"
          name="trashcan"
          onPress={() =>
            dispatch(actions.deleteColumn({ columnId, columnIndex }))
          }
          tooltip="Remove column"
          type="danger"
        />
      </View>

      <Separator horizontal />
    </ThemedView>
  )
})

ColumnOptions.displayName = 'ColumnOptions'
